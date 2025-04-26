import { createMiddleware } from 'hono/factory'
import { getCookie } from 'hono/cookie'
import { PATHS, COOKIES } from '../constants'
import { findSessionById } from '../support/db-access'
import { isErr } from 'true-myth/result'
import { isNothing } from 'true-myth/maybe'
import { redirectWithError } from '../support/redirects'
import type { Bindings } from '../local-types'

/**
 * Middleware to restrict access to signed-in users only.
 * If the user is not signed in, redirect to sign-in page with an error message.
 */
export const signedInAccess = createMiddleware<{ Bindings: Bindings }>(
  async (c, next) => {
    const sessionId = getCookie(c, COOKIES.SESSION)
    if (!sessionId) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'You must sign in to visit that page'
      )
    }

    const sessionResult = await findSessionById(c.env.DB, sessionId)
    if (isErr(sessionResult)) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'You must sign in to visit that page'
      )
    }

    const maybeSession = sessionResult.value
    if (isNothing(maybeSession) || !maybeSession.value.signedIn) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'You must sign in to visit that page'
      )
    }

    await next()
  }
)
