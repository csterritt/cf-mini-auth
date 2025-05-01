/**
 * Route handler for the resend OTP code path (POST).
 * @module routes/auth/handleResendCode
 */
import { Hono } from 'hono'
import { PATHS } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithMessage } from '../../lib/redirects'

/**
 * Attach the resend OTP POST route to the app.
 * @param app - Hono app instance
 */
export const handleResendCode = (app: Hono<{ Bindings: Bindings }>): void => {
  app.post(PATHS.AUTH.RESEND_CODE, async (c) => {
    // In a real implementation, you would trigger the resend logic here.
    return redirectWithMessage(c, PATHS.AUTH.AWAIT_CODE, 'Code sent!')
  })
}
