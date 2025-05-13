/**
 * Route builder for the count path.
 * @module routes/buildCount
 */
import { Hono, Context } from 'hono'

import { PATHS } from '../constants'
import { Bindings } from '../local-types'
import { findCountById } from '../lib/db-access'
import { useLayout } from './buildLayout'
import { isErr } from 'true-myth/result'
import { isJust } from 'true-myth/maybe'

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
        <a href={PATHS.HOME} data-testid='visit-home-link'>
          Go home
        </a>
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
    const countResult = await findCountById(c.env.DB, 'foo')
    if (isErr(countResult)) {
      return c.render(
        renderCount(
          c,
          0,
          `======> buildCount: Database error ${countResult.error}`
        )
      )
    }

    // Only access .value if Ok
    const maybeCount = countResult.value
    if (isJust(maybeCount)) {
      return c.render(useLayout(c, renderCount(c, maybeCount.value.count)))
    } else {
      return c.render(useLayout(c, renderCount(c, 0, 'No count found')))
    }
  })
}
