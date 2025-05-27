/**
 * Route handler for resetting the server clock (for testing).
 * @module routes/auth/handleResetClock
 */
import { Hono } from 'hono'

import { PATHS } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithMessage } from '../../lib/redirects'
import { clearCurrentDelta } from '../../lib/time-access'

/**
 * Attach the reset clock GET route to the app.
 * @param app - Hono app instance
 */
export const handleResetClock = (app: Hono<{ Bindings: Bindings }>): void => {
  app.get(PATHS.AUTH.RESET_CLOCK, async (c) => {
     return redirectWithMessage(c, PATHS.HOME, '') 
     }) 
     } 
