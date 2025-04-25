/**
 * Route handler for the start OTP path (POST).
 * @module routes/auth/handleStartOtp
 */
import { Hono } from 'hono'

import { PATHS } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithError } from '../../support/redirects'
import { VALIDATION } from '../../constants'

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

    // Simple email validation (should use shared regex in production)
    if (!email || !VALIDATION.EMAIL_REGEX.test(email)) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Please enter a valid email address'
      )
    }

    // TODO: Implement OTP start logic here (send code, etc.)
    // For now, just redirect to sign-in with a success message or next step
    return redirectWithError(
      c,
      PATHS.AUTH.SIGN_IN,
      'OTP flow not yet implemented'
    )
  })
}
