/**
 * Route handler for the increment path (POST).
 * @module routes/handleIncrement
 */
import { Hono } from 'hono'

import { PATHS } from '../constants'
import { Bindings } from '../local-types'
import { incrementCountById } from '../support/db-access'
import { redirectWithMessage, redirectWithError } from '../support/redirects'

/**
 * Attach the increment POST route to the app.
 * @param app - Hono app instance
 */
export const handleIncrement = (app: Hono<{ Bindings: Bindings }>): void => {
  app.post(PATHS.INCREMENT, async (c) => {
    try {
      await incrementCountById(c.env.DB, 'foo')

      return redirectWithMessage(c, PATHS.COUNT, 'Increment successful')
    } catch (error) {
      console.error('Error incrementing count:', error)
      // Redirect with an error message
      return redirectWithError(c, PATHS.COUNT, 'Database error')
    }
  })
}
