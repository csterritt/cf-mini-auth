/**
 * Route handler for the increment path (POST).
 * @module routes/handleIncrement
 */
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { isErr } from 'true-myth/result'

import { PATHS } from '../constants'
import { Bindings, CountAndDecrement } from '../local-types'
import { incrementCountById } from '../lib/db-access'
import { redirectWithMessage, redirectWithError } from '../lib/redirects'
import { signedInAccess } from '../middleware/signed-in-access'
import { COOKIES } from '../constants'

/**
 * Attach the increment POST route to the app.
 * @param app - Hono app instance
 */
export const handleIncrement = (app: Hono<{ Bindings: Bindings }>): void => {
  app.post(PATHS.INCREMENT, signedInAccess, async (c) => {
    // Check for DB_FAIL_INCR cookie using getCookie // PRODUCTION:REMOVE
    let dbFailCount: CountAndDecrement | undefined = undefined
    const failCountCookie = getCookie(c, COOKIES.DB_FAIL_INCR) // PRODUCTION:REMOVE
    // PRODUCTION:REMOVE-NEXT-LINE
    if (failCountCookie && !isNaN(Number(failCountCookie))) {
      dbFailCount = new CountAndDecrement(Number(failCountCookie)) // PRODUCTION:REMOVE
    } // PRODUCTION:REMOVE

    const result = await incrementCountById(c.env.DB, 'foo', dbFailCount)
    if (isErr(result)) {
      console.error('======> Error incrementing count:', result.error)
      return redirectWithError(
        c,
        PATHS.COUNT,
        'Internal problem: Database error'
      )
    }

    // Success, regardless of Maybe
    return redirectWithMessage(c, PATHS.COUNT, 'Increment successful')
  })
}
