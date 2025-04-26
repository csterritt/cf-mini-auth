/**
 * Route handler for the finish OTP path (POST).
 * @module routes/auth/handleFinishOtp
 */
import { Hono } from 'hono'
import { getCookie, deleteCookie } from 'hono/cookie'
import { isErr } from 'true-myth/result'
import { isNothing } from 'true-myth/maybe'

import { PATHS, COOKIES } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithError, redirectWithMessage } from '../../support/redirects'
import {
  findSessionById,
  findUserById,
  updateSessionById,
} from '../../support/db-access'

/**
 * Attach the finish OTP POST route to the app.
 * @param app - Hono app instance
 */
export const handleFinishOtp = (app: Hono<{ Bindings: Bindings }>): void => {
  app.post(PATHS.AUTH.FINISH_OTP, async (c) => {
    // Validate and handle OTP finish logic
    const formData = await c.req.parseBody()
    const email =
      typeof formData.email === 'string' ? formData.email.trim() : ''
    const otp = typeof formData.otp === 'string' ? formData.otp.trim() : ''

    // Get SESSION cookie and check existence
    const sessionId: string = (getCookie(c, COOKIES.SESSION) ?? '').trim()
    if (sessionId == '') {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Sign in flow problem, please sign in again'
      )
    }

    // Validate OTP (should be 6 digits)
    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      return redirectWithError(
        c,
        PATHS.AUTH.AWAIT_CODE,
        'Please enter a valid 6-digit code.'
      )
    }

    // Read session from database
    const sessionResult = await findSessionById(c.env.DB, sessionId)
    if (isErr(sessionResult)) {
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }

    const maybeSession = sessionResult.value
    if (isNothing(maybeSession)) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Sign in flow problem, please sign in again'
      )
    }
    const session = maybeSession.value

    const userResult = await findUserById(c.env.DB, session.userId)
    if (isErr(userResult)) {
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }

    const maybeUser = userResult.value
    if (isNothing(maybeUser)) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Sign in flow problem, please sign in again'
      )
    }

    const user = maybeUser.value
    if (user.email !== email) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Sign in flow problem, please sign in again'
      )
    }

    if (session.token !== otp) {
      return redirectWithError(
        c,
        PATHS.AUTH.AWAIT_CODE,
        'Invalid OTP or verification failed'
      )
    }

    // Update session: expire in 6 months, set signedIn true
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000)
    const updateResult = await updateSessionById(c.env.DB, sessionId, {
      signedIn: true,
      expiresAt,
      updatedAt: now,
    })

    if (isErr(updateResult)) {
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }

    deleteCookie(c, COOKIES.EMAIL_ENTERED, { path: '/' })
    deleteCookie(c, COOKIES.ERROR_FOUND, { path: '/' })

    // Redirect to sign-in with a success message (or next step)
    return redirectWithMessage(
      c,
      PATHS.HOME,
      'You have signed in successfully!'
    )
  })
}
