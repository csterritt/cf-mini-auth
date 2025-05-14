import { createMiddleware } from 'hono/factory'
import { Context } from 'hono'

import { PATHS } from '../constants'
import { redirectWithError } from '../lib/redirects'
import type { Bindings } from '../local-types'

/**
 * Middleware to restrict access to signed-in users only.
 * If the user is not signed in, redirect to sign-in page with an error message.
 */
export const signedInAccess = createMiddleware<{ Bindings: Bindings }>(
  async (c: Context, next) => {
    if (c.env.Session.isNothing) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'You must sign in to visit that page'
      )
    }

    const maybeSession = c.env.Session.value
    if (!maybeSession.signedIn) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'You must sign in to visit that page'
      )
    }

    // Set no-cache headers for signed-in users
    c.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    c.header('Pragma', 'no-cache')
    c.header('Expires', '0')

    await next()
  }
)
