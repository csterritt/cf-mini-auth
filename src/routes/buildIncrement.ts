/**
 * Route builder for the increment path (POST).
 * @module routes/buildIncrement
 */
import { Hono } from 'hono'
import { PATHS, HTML_STATUS } from '../constants'

/**
 * Attach the increment POST route to the app.
 * @param app - Hono app instance
 */
export const buildIncrement = (app: Hono): void => {
  app.post(PATHS.INCREMENT, (c) =>
    c.redirect(PATHS.COUNT, HTML_STATUS.SEE_OTHER)
  )
}
