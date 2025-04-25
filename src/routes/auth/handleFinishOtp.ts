/**
 * Route handler for the finish OTP path (POST).
 * @module routes/auth/handleFinishOtp
 */
import { Hono } from 'hono'
import { getCookie, deleteCookie } from 'hono/cookie'

import { PATHS, COOKIES } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithError, redirectWithMessage } from '../../support/redirects'
import prismaClients from '../../lib/prismaClient'

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
    const prisma = await prismaClients.fetch(c.env.DB)
    // @ts-ignore
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })
    if (!session) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Sign in flow problem, please sign in again'
      )
    }

    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user || user.email !== email) {
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
    // @ts-ignore
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        signedIn: true,
        expiresAt,
        updatedAt: now,
      },
    })

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
