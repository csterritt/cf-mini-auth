/**
 * Route handler for the start OTP path (POST).
 * @module routes/auth/handleStartOtp
 */
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'

import { PATHS, VALIDATION, COOKIES } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithError, redirectWithMessage } from '../../support/redirects'
import prismaClients from '../../lib/prismaClient'

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
    const prisma = await prismaClients.fetch(c.env.DB)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Please enter a valid email address'
      )
    }

    // TODO: Implement OTP start logic here (send code, etc.)
    // For now, just redirect to sign-in with a success message or next step
    return redirectWithMessage(c, PATHS.AUTH.AWAIT_CODE, '')
  })
}
