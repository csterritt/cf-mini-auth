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
    const prisma = await prismaClients.fetch(c.env.DB)
    const updateInfo = await prisma.count.update({
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
  })
}
