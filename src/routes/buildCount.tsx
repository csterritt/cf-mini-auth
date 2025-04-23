/**
 * Route builder for the count path.
 * @module routes/buildCount
 */
import { Hono, Context } from 'hono'
import { PATHS } from '../constants'

/**
 * Render the JSX for the count page.
 * @param c - Hono context
 */
const renderCount = (c: Context) => {
  return (
    <div>
      <h3>Count</h3>
      <p>Current value: 0</p>
      <p>
        <a href={PATHS.HOME}>Go home</a>
      </p>
      <form method="post" action={PATHS.INCREMENT}>
        <button type="submit">Increment the count</button>
      </form>
    </div>
  )
}

/**
 * Attach the count route to the app.
 * @param app - Hono app instance
 */
export const buildCount = (app: Hono): void => {
  app.get(PATHS.COUNT, (c) => c.render(renderCount(c)))
}
