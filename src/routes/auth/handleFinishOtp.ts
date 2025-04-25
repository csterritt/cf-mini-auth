/**
 * Route handler for the finish OTP path (POST).
 * @module routes/auth/handleFinishOtp
 */
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'

import { PATHS, COOKIES } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithError } from '../../support/redirects'

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

    // Store the entered email in a cookie (again, for continuity)
    setCookie(c, COOKIES.EMAIL_ENTERED, email, COOKIES.STANDARD_COOKIE_OPTIONS)

    // Validate OTP (should be 6 digits)
    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      return redirectWithError(
        c,
        PATHS.AUTH.AWAIT_CODE,
        'Please enter a valid 6-digit code.'
      )
    }
    // TODO: Implement OTP verification logic here (check code, etc.)
    // For now, just redirect to sign-in with a not-implemented message
    return redirectWithError(
      c,
      PATHS.AUTH.SIGN_IN,
      'OTP verification not yet implemented'
    )
  })
}
