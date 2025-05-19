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
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, VALIDATION.EMAIL_INVALID)
    }
    const user = maybeUser.value

    // Create a new session for the user
    const sessionId: string = ulid()
    const sessionToken: string = await generateToken()
    const now = getCurrentTime(c)
    // Session expires in 15 minutes
    const expiresAt = getCurrentTime(
      c,
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
      console.log(
        `======> Database error getting session: ${sessionResult.error}`
      )
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }
    setCookie(c, COOKIES.SESSION, sessionId, COOKIES.STANDARD_COOKIE_OPTIONS)
    c.header('X-Session-Token', sessionToken) // PRODUCTION:REMOVE

    // TODO: Send the OTP code to the user
    console.log(`======> The session token is ${sessionToken}`) // PRODUCTION:REMOVE

    // For now, just redirect to await code page
    return redirectWithMessage(c, PATHS.AUTH.AWAIT_CODE, '')
  })
}
