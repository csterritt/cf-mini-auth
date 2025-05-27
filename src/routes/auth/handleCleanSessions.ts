/**
 * Route handler for cleaning all sessions for a user (for testing).
 * @module routes/auth/handleCleanSessions
 */
import { Hono } from 'hono'

import { PATHS } from '../../constants'
import { Bindings } from '../../local-types'
import { redirectWithMessage, redirectWithError } from '../../lib/redirects'
import { deleteAllUserSessions } from '../../lib/db-access'
import { isErr } from 'true-myth/result'

/**
 * Attach the clean sessions GET route to the app.
 * @param app - Hono app instance
 */
export const handleCleanSessions = (
  app: Hono<{ Bindings: Bindings }>
): void => {
  app.get(`${PATHS.AUTH.CLEAN_SESSIONS}/:email`, async (c) => {
     return redirectWithMessage(c, PATHS.HOME, '') 
     }) 
     } 
