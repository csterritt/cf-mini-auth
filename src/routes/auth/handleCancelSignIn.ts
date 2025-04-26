/**
 * Route handler for canceling sign-in (POST).
 * @module routes/auth/handleCancelSignIn
 */
import { Hono } from 'hono'
import { deleteCookie } from 'hono/cookie'

import { PATHS, COOKIES } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithMessage } from '../../lib/redirects'

/**
 * Attach the cancel sign-in route to the app.
 * @param app - Hono app instance
 */
export const handleCancelSignIn = (app: Hono<{ Bindings: Bindings }>): void => {
  app.post(PATHS.AUTH.CANCEL_OTP, (c) => {
    deleteCookie(c, COOKIES.EMAIL_ENTERED, { path: '/' })
    deleteCookie(c, COOKIES.ERROR_FOUND, { path: '/' })
    deleteCookie(c, COOKIES.SESSION, { path: '/' })

    return redirectWithMessage(c, PATHS.HOME, 'Sign in canceled.')
  })
}
