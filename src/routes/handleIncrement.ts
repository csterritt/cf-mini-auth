/**
 * Route handler for the increment path (POST).
 * @module routes/handleIncrement
 */
import { Hono } from 'hono'
import { isErr } from 'true-myth/result'

import { PATHS } from '../constants'
import { Bindings } from '../local-types'
import { incrementCountById } from '../lib/db-access'
import { redirectWithMessage, redirectWithError } from '../lib/redirects'

/**
 * Attach the increment POST route to the app.
 * @param app - Hono app instance
 */
export const handleIncrement = (app: Hono<{ Bindings: Bindings }>): void => {
  app.post(PATHS.INCREMENT, async (c) => {
    const result = await incrementCountById(c.env.DB, 'foo')
    if (isErr(result)) {
      console.error('Error incrementing count:', result.error)
      return redirectWithError(c, PATHS.COUNT, 'Database error')
    }

    // Success, regardless of Maybe
    return redirectWithMessage(c, PATHS.COUNT, 'Increment successful')
  })
}
