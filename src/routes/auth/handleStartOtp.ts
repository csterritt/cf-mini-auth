/**
 * Route handler for the start OTP path (POST).
 * @module routes/auth/handleStartOtp
 */
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { ulid } from 'ulid'
import { isErr } from 'true-myth/result'
import { isNothing } from 'true-myth/maybe'

import { PATHS, VALIDATION, COOKIES, DURATIONS } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithError, redirectWithMessage } from '../../lib/redirects'
import { findUserByEmail, createSession } from '../../lib/db-access'
import { generateToken } from '../../lib/generate-code'
import { getCurrentTime } from '../../lib/time-access'

/**
 * Attach the start OTP POST route to the app.
 * @param app - Hono app instance
 */
export const handleStartOtp = (app: Hono<{ Bindings: Bindings }>): void => {
  app.post(PATHS.AUTH.START_OTP, async (c) => {
    // Example: validate email and handle OTP start logic
    const formData = await c.req.parseBody()
    const email =
      typeof formData.email === 'string' ? formData.email.trim() : ''

    // Store the entered email in a cookie
    setCookie(c, COOKIES.EMAIL_ENTERED, email, COOKIES.STANDARD_COOKIE_OPTIONS)

    // Simple email validation (should use shared regex in production)
    if (
      !email ||
      !VALIDATION.EMAIL_REGEX.test(email) ||
      email.length < 5 ||
      email.length > 254
    ) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Please enter a valid email address'
      )
    }

    // Check if user exists in the database
    const userResult = await findUserByEmail(c.env.DB, email)
    if (isErr(userResult)) {
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }

    const maybeUser = userResult.value
    if (isNothing(maybeUser)) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Please enter a valid email address'
      )
    }
    const user = maybeUser.value

    // Create a new session for the user
    const sessionId: string = ulid()
    const sessionToken: string = await generateToken()
    const now = getCurrentTime()
    // Session expires in 15 minutes
    const expiresAt = getCurrentTime(
      now.getTime() + DURATIONS.FIFTEEN_MINUTES_IN_MILLISECONDS
    )

    const sessionResult = await createSession(c.env.DB, {
      id: sessionId,
      token: sessionToken,
      userId: user.id,
      signedIn: false,
      createdAt: now,
      updatedAt: now,
      expiresAt,
    })

    if (isErr(sessionResult)) {
      // TODO: Figure out what to do here with session and cookies
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }
    setCookie(c, COOKIES.SESSION, sessionId, COOKIES.STANDARD_COOKIE_OPTIONS)

    // TODO: Send the OTP code to the user
    console.log(`======> The session token is ${sessionToken}`)

    // For now, just redirect to await code page
    return redirectWithMessage(c, PATHS.AUTH.AWAIT_CODE, '')
  })
}
