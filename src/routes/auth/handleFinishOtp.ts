/**
 * Route handler for the finish OTP path (POST).
 * @module routes/auth/handleFinishOtp
 */
import { Hono } from 'hono'
import { getCookie, deleteCookie, setCookie } from 'hono/cookie'
import { isErr } from 'true-myth/result'
import { isNothing } from 'true-myth/maybe'

import { PATHS, COOKIES, DURATIONS } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithError, redirectWithMessage } from '../../lib/redirects'
import {
  deleteSession,
  findSessionById,
  findUserById,
  updateSessionById,
} from '../../lib/db-access'
import { getCurrentTime } from '../../lib/time-access'

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
      // TODO: clean out session and cookies
      console.log(
        `======> Database error getting session: ${sessionResult.error}`
      )
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }

    const maybeSession = sessionResult.value
    if (isNothing(maybeSession)) {
      deleteCookie(c, COOKIES.SESSION, { path: '/' })

      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Sign in flow problem, please sign in again'
      )
    }
    const session = maybeSession.value

    // see if this session has expired
    const now = getCurrentTime()
    if (session.expiresAt < now) {
      await deleteSession(c.env.DB, sessionId)
      deleteCookie(c, COOKIES.SESSION, { path: '/' })

      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Sign in code has expired, please sign in again'
      )
    }

    const userResult = await findUserById(c.env.DB, session.userId)
    if (isErr(userResult)) {
      // TODO: clean out session and cookies
      console.log(`======> Database error getting user: ${userResult.error}`)
      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }

    const maybeUser = userResult.value
    if (isNothing(maybeUser)) {
      await deleteSession(c.env.DB, sessionId)
      deleteCookie(c, COOKIES.SESSION, { path: '/' })

      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Sign in flow problem, please sign in again'
      )
    }

    const user = maybeUser.value
    if (user.email !== email) {
      await deleteSession(c.env.DB, sessionId)
      deleteCookie(c, COOKIES.SESSION, { path: '/' })
      deleteCookie(c, COOKIES.EMAIL_ENTERED, { path: '/' })

      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Sign in flow problem, please sign in again'
      )
    }

    if (session.token !== otp) {
      // PRODUCTION:REMOVE-NEXT-LINE
      if (otp !== '123456') {
        // Increment attemptCount
        const newAttemptCount: number =
          (typeof session.attemptCount === 'number'
            ? session.attemptCount
            : 0) + 1
        if (newAttemptCount >= 3) {
          await deleteSession(c.env.DB, sessionId)
          deleteCookie(c, COOKIES.SESSION, { path: '/' })

          return redirectWithError(
            c,
            PATHS.AUTH.SIGN_IN,
            'Too many failed attempts. Please sign in again.'
          )
        }

        // Save updated attemptCount in session
        await updateSessionById(c.env.DB, sessionId, {
          attemptCount: newAttemptCount,
          updatedAt: getCurrentTime(),
        })

        return redirectWithError(
          c,
          PATHS.AUTH.AWAIT_CODE,
          'Invalid OTP or verification failed'
        )
        // PRODUCTION:REMOVE-NEXT-LINE
      }
    }

    // Update session: expire in 6 months, set signedIn true
    const now2 = getCurrentTime()
    const expiresAt = getCurrentTime(
      now2.getTime() + DURATIONS.SIX_MONTHS_IN_MILLISECONDS
    )
    const updateResult = await updateSessionById(c.env.DB, sessionId, {
      signedIn: true,
      token: '',
      attemptCount: 0,
      expiresAt,
      updatedAt: now2,
    })

    if (isErr(updateResult)) {
      // TODO: figure out what to do here with session and cookies
      console.log(
        `======> Database error updating session: ${updateResult.error}`
      )

      return redirectWithError(c, PATHS.AUTH.SIGN_IN, 'Database error')
    }

    deleteCookie(c, COOKIES.EMAIL_ENTERED, { path: '/' })
    deleteCookie(c, COOKIES.ERROR_FOUND, { path: '/' })
    setCookie(c, COOKIES.SESSION, sessionId, {
      ...COOKIES.STANDARD_COOKIE_OPTIONS,
      expires: expiresAt,
    })

    // Redirect to sign-in with a success message (or next step)
    return redirectWithMessage(
      c,
      PATHS.PRIVATE,
      'You have signed in successfully!'
    )
  })
}
