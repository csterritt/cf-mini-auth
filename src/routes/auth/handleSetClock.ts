/**
 * Route handler for setting the server clock (for testing).
 * @module routes/auth/handleSetClock
 */
import { Hono } from 'hono'
import { PATHS } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithMessage } from '../../lib/redirects'
import { setCurrentTime, getCurrentTime } from '../../lib/time-access'

/**
 * Attach the set clock GET route to the app.
 * @param app - Hono app instance
 */
export const handleSetClock = (app: Hono<{ Bindings: Bindings }>): void => {
  app.get(`${PATHS.AUTH.SET_CLOCK}/:timestamp`, async (c) => {
    // return redirectWithMessage(c, PATHS.HOME, '') // PRODUCTION:UNCOMMENT
    const timestamp = parseInt(c.req.param('timestamp'))
    setCurrentTime(new Date(timestamp))

    // For test: pretend to set the server clock (no-op in prod)
    // Accept a timestamp or ISO string in the body (for extensibility)
    // In a real implementation, you would update a test clock here
    return redirectWithMessage(c, PATHS.HOME, 'Clock set!')
  })
}
