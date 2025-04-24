/**
 * Route builder for the increment path (POST).
 * @module routes/buildIncrement
 */
import { Hono } from 'hono'

import { PATHS, HTML_STATUS } from '../constants'
import { Bindings } from '../local-types'
import prismaClients from '../lib/prismaClient'

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

      return c.redirect(PATHS.COUNT, HTML_STATUS.SEE_OTHER)
    } catch (error) {
      console.error('Error incrementing count:', error)
      // Optionally, redirect with an error message or render an error page
      return c.text('Database error', 500)
    }
  })
}
