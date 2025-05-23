/**
 * Route handler for the start OTP path (POST).
 * @module routes/auth/handleStartOtp
 */
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { ulid } from 'ulid'
import { isErr } from 'true-myth/result'
import { isNothing } from 'true-myth/maybe'

import { PATHS, COOKIES, DURATIONS, VALIDATION } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithError, redirectWithMessage } from '../../lib/redirects'
import { findUserByEmail, createSession } from '../../lib/db-access'
import { generateToken } from '../../lib/generate-code'
import { getCurrentTime } from '../../lib/time-access'
import { StartOtpSchema, validateRequest } from '../../lib/validators'
// import { sendOtpToUserViaEmail } from '../../lib/send-email'  // PRODUCTION:UNCOMMENT

// Simple in-memory rate limiting
// Maps email to an array of timestamps when OTP requests were made
const otpRequestsMap = new Map<string, number[]>()
const MAX_REQUESTS_PER_WINDOW = 3 // Maximum 3 requests
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000 // 5 minutes in milliseconds

/**
 * Check if the email has exceeded the rate limit
 * @param email - The email to check
 * @param now - Current timestamp
 * @returns true if rate limited, false otherwise
 */
function isRateLimited(email: string, now: number): boolean {
  const requests = otpRequestsMap.get(email) || []

  // Filter out requests older than the rate limit window
  const recentRequests = requests.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  )

  // Update the map with only recent requests
  otpRequestsMap.set(email, recentRequests)

  // Check if the number of recent requests exceeds the limit
  return recentRequests.length >= MAX_REQUESTS_PER_WINDOW
}

/**
 * Record a new OTP request for the email
 * @param email - The email to record the request for
 * @param now - Current timestamp
 */
function recordOtpRequest(email: string, now: number): void {
  const requests = otpRequestsMap.get(email) || []
  requests.push(now)
  otpRequestsMap.set(email, requests)
}

/**
 * Reset rate limiting for a specific email
 * @param email - The email to reset rate limiting for
 */
function resetRateLimiting(email: string): void {
  otpRequestsMap.delete(email)
}

/**
 * Attach the start OTP POST route to the app.
 * @param app - Hono app instance
 */
export const handleStartOtp = (app: Hono<{ Bindings: Bindings }>): void => {
  app.post(PATHS.AUTH.START_OTP, async (c) => {
    // Example: validate email and handle OTP start logic
    const formData = await c.req.parseBody()

    const enteredEmail =
      typeof formData.email === 'string' ? formData.email.trim() : ''

    // Store the entered email in a cookie
    setCookie(
      c,
      COOKIES.EMAIL_ENTERED,
      enteredEmail,
      COOKIES.STANDARD_COOKIE_OPTIONS
    )
    // Validate the request using Valibot schema
    let [isValid, validatedData, errorMessage] = validateRequest(
      formData,
      StartOtpSchema
    )

    if (!isValid || !validatedData) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        errorMessage || VALIDATION.EMAIL_INVALID
      )
    }

    const email = validatedData.email
    const now = getCurrentTime(c).getTime()

    // Check if we should reset rate limiting for this email // PRODUCTION:REMOVE
    // PRODUCTION:REMOVE-NEXT-LINE
    if (c.req.query('reset-rate-limit') === 'true') {
      resetRateLimiting(email) // PRODUCTION:REMOVE
    } // PRODUCTION:REMOVE

    // Only apply rate limiting if the rate-limit-test query parameter is present and set to true // PRODUCTION:REMOVE
    const rateLimitTest = c.req.query('rate-limit-test') === 'true' // PRODUCTION:REMOVE

    // PRODUCTION:REMOVE-NEXT-LINE
    if (rateLimitTest) {
      // Check rate limiting
      if (isRateLimited(email, now)) {
        // Set retry-after header (in seconds)
        c.header(
          'Retry-After',
          Math.ceil(RATE_LIMIT_WINDOW_MS / 1000).toString()
        )
        // Return 429 Too Many Requests
        return c.text(
          'Too many OTP requests. Please try again later due to rate limit.',
          429
        )
      }

      // Record this OTP request
      recordOtpRequest(email, now)
    } // PRODUCTION:REMOVE

    // Is there a session already?
    if (c.env.Session.isJust && c.env.Session.value.signedIn) {
      return redirectWithError(c, PATHS.PRIVATE, 'Already signed in')
    }

    // Check if user exists in the database
    const userResult = await findUserByEmail(c.env.DB, email)
    if (isErr(userResult)) {
      console.log(`======> Database error getting user: ${userResult.error}`)
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }

    const maybeUser = userResult.value
    if (isNothing(maybeUser)) {
      console.log(`There is no user for the %s email`, email)
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, VALIDATION.EMAIL_INVALID)
    }
    const user = maybeUser.value

    // Create a new session for the user
    const sessionId: string = ulid()
    const sessionToken: string = await generateToken()
    const nowDate = getCurrentTime(c)
    // Session expires in 15 minutes
    const expiresAt = getCurrentTime(
      c,
      nowDate.getTime() + DURATIONS.FIFTEEN_MINUTES_IN_MILLISECONDS
    )

    const sessionResult = await createSession(c.env.DB, {
      id: sessionId,
      token: sessionToken,
      userId: user.id,
      signedIn: false,
      createdAt: nowDate,
      updatedAt: nowDate,
      expiresAt,
    })

    if (isErr(sessionResult)) {
      // TODO: Figure out what to do here with session and cookies
      console.log(
        `======> Database error getting session: ${sessionResult.error}`
      )
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }
    setCookie(c, COOKIES.SESSION, sessionId, COOKIES.STANDARD_COOKIE_OPTIONS)
    c.header('X-Session-Token', sessionToken) // PRODUCTION:REMOVE

    // Send the OTP code to the user via email
    try {
      console.log(`======> The session token is ${sessionToken}`) // PRODUCTION:REMOVE

      // sendOtpToUserViaEmail(email, sessionToken)  // PRODUCTION:UNCOMMENT
    } catch (error) {
      console.error('Failed to send email:', error)
      // Continue with the flow even if email sending fails
      // In production, you might want to handle this differently
    }

    // For now, just redirect to await code page
    return redirectWithMessage(c, PATHS.AUTH.AWAIT_CODE, '')
  })
}
