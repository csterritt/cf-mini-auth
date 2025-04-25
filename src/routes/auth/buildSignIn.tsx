/**
 * Route builder for the sign-in page.
 * @module routes/auth/buildSignIn
 */
import { Hono, Context } from 'hono'

import { PATHS } from '../../constants'
import { Bindings } from '../../local-types'
import { useLayout } from '../buildLayout'
import { getCookie } from 'hono/cookie'
import { COOKIES } from '../../constants'

/**
 * Render the JSX for the sign-in page.
 * @param c - Hono context
 */
const renderSignIn = (c: Context) => {
  const emailEntered: string = getCookie(c, COOKIES.EMAIL_ENTERED) ?? ''
  return (
    <div data-testid='sign-in-page-banner'>
      <h3>Sign In</h3>
      <form
        method='post'
        action={PATHS.AUTH.START_OTP}
        className='flex flex-col gap-4'
      >
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          name='email'
          type='email'
          placeholder='Email'
          required
          className='input input-bordered'
          autoFocus
          value={emailEntered}
          data-testid='email-input'
        />
        <button type='submit' className='btn btn-primary' data-testid='submit'>
          Sign In
        </button>
      </form>
      <p>
        <a href={PATHS.HOME} data-testid='root-link'>
          Go home
        </a>
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
