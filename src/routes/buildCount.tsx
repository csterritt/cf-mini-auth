/**
 * Route builder for the count path.
 * @module routes/buildCount
 */
import { Hono, Context } from 'hono'

import { PATHS } from '../constants'
import { Bindings } from '../local-types'
import prismaClients from '../lib/prismaClient'

/**
 * Render the JSX for the count page.
 * @param c - Hono context
 */
const renderCount = (c: Context, count: number, error?: string) => {
  return (
    <div>
      <h3>Count</h3>
      <p>Current value: {error ? `Error ${error}` : count}</p>
      <p>
        <a href={PATHS.HOME}>Go home</a>
      </p>
      <form method='post' action={PATHS.INCREMENT}>
        <button type='submit'>Increment the count</button>
      </form>
    </div>
  )
}

/**
 * Attach the count route to the app.
 * @param app - Hono app instance
 */
export const buildCount = async (
  app: Hono<{ Bindings: Bindings }>
): Promise<void> => {
  app.get(PATHS.COUNT, async (c) => {
    const prisma = await prismaClients.fetch(c.env.DB)
    const count = await prisma.count.findFirst({
      where: {
        id: 'foo',
      },
    })

    return c.render(
      renderCount(
        c,
        count?.count ?? 0,
        count == null ? 'No count found' : undefined
      )
    )
  })
}
