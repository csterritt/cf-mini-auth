/**
 * Route builder for the increment path (POST).
 * @module routes/buildIncrement
 */
import { Hono } from 'hono'

import { PATHS } from '../constants'
import { Bindings } from '../local-types'
import prismaClients from '../lib/prismaClient'
import { redirectWithMessage, redirectWithError } from '../support/redirects'

/**
 * Attach the increment POST route to the app.
 * @param app - Hono app instance
 */
export const buildIncrement = (app: Hono<{ Bindings: Bindings }>): void => {
  app.post(PATHS.INCREMENT, async (c) => {
    try {
      const prisma = await prismaClients.fetch(c.env.DB)
      await prisma.count.update({
        where: {
          id: 'foo',
        },
        data: {
          count: {
            increment: 1,
          },
        },
      })

      return redirectWithMessage(c, PATHS.COUNT, 'Increment successful')
    } catch (error) {
      console.error('Error incrementing count:', error)
      // Redirect with an error message
      return redirectWithError(c, PATHS.COUNT, 'Database error')
    }
  })
}
