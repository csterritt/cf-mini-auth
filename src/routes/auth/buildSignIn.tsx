/**
 * Route builder for the sign-in page.
 * @module routes/auth/buildSignIn
 */
import { Hono, Context } from 'hono'

import { PATHS } from '../../constants'
import { Bindings } from '../../local-types'
import { useLayout } from '../buildLayout'

/**
 * Render the JSX for the sign-in page.
 * @param c - Hono context
 */
const renderSignIn = (c: Context) => {
  return (
    <div data-testid='sign-in-page-banner'>
      <h3>Sign In</h3>
      <form method='post' action={PATHS.AUTH.SIGN_IN} className='flex flex-col gap-4'>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          name='email'
          type='email'
          required
          className='input input-bordered'
          autoFocus
        />
        <button type='submit' className='btn btn-primary'>Sign In</button>
      </form>
      <p>
        <a href={PATHS.HOME} data-testid='root-link'>Go home</a>
      </p>
    </div>
  )
}

/**
 * Attach the sign-in route to the app.
 * @param app - Hono app instance
 */
export const buildSignIn = (app: Hono<{ Bindings: Bindings }>): void => {
  app.get(PATHS.AUTH.SIGN_IN, (c) => c.render(useLayout(c, renderSignIn(c))))
}
