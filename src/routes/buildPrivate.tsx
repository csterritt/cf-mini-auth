/**
 * Route builder for the private path.
 * @module routes/buildPrivate
 */
import { Hono, Context } from 'hono'

import { PATHS } from '../constants'
import { Bindings } from '../local-types'
import { useLayout } from './buildLayout'
import { signedInAccess } from '../middleware/signed-in-access'

/**
 * Render the JSX for the private page.
 * @param c - Hono context
 */
const renderPrivate = (c: Context) => {
  return (
    <div>
      <h3>Private</h3>
      <p>
        <a href={PATHS.HOME}>Go home</a>
      </p>
    </div>
  )
}

/**
 * Attach the private route to the app.
 * @param app - Hono app instance
 */
export const buildPrivate = (app: Hono<{ Bindings: Bindings }>): void => {
  app.get(PATHS.PRIVATE, signedInAccess, (c) =>
    c.render(useLayout(c, renderPrivate(c)))
  )
}
