/**
 * Route handler for setting DB failure count (for testing).
 * @module routes/handleSetDbFailures
 */
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'

import { PATHS, COOKIES } from '../constants'
import { Bindings } from '../local-types'
import { redirectWithMessage } from '../lib/redirects'

/**
 * Attach the set DB failures POST route to the app.
 * @param app - Hono app instance
 */
export const handleSetDbFailures = (
  app: Hono<{ Bindings: Bindings }>
): void => {
  app.get(`${PATHS.AUTH.SET_DB_FAILURES}/:times`, async (c) => {
    const times = c.req.param('times')
    if (!times || isNaN(Number(times))) {
      return redirectWithMessage(c, PATHS.HOME, 'Invalid times parameter')
    }

    setCookie(c, COOKIES.DB_FAIL_COUNT, times, COOKIES.STANDARD_COOKIE_OPTIONS)

    return redirectWithMessage(c, PATHS.HOME, ``)
  })
}
