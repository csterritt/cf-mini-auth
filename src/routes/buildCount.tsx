/**
 * Route builder for the count path.
 * @module routes/buildCount
 */
import { Hono, Context } from 'hono'

import { PATHS } from '../constants'
import { Bindings } from '../local-types'
import { findCountById } from '../support/db-access'
import { useLayout } from './buildLayout'

/**
 * Render the JSX for the count page.
 * @param c - Hono context
 */
const renderCount = (c: Context, count: number, error?: string) => {
  return (
    <div>
      <h3>Count</h3>
      <p data-testid='count-value'>{error ? `Error ${error}` : count}</p>
      <p>
        <a href={PATHS.HOME}>Go home</a>
      </p>
      <form method='post' action={PATHS.INCREMENT}>
        <button type='submit' data-testid='increment-count-link'>
          Increment the count
        </button>
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
    try {
      const count = await findCountById(c.env.DB, 'foo')

      return c.render(
        useLayout(
          c,
          renderCount(
            c,
            count?.count ?? 0,
            count == null ? 'No count found' : undefined
          )
        )
      )
    } catch (error) {
      console.error('Error fetching count:', error)
      return c.render(renderCount(c, 0, 'Database error'))
    }
  })
}
