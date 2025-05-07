/**
 * Route builder for the sign-in page.
 * @module routes/auth/buildSignIn
 */
import { Hono, Context } from 'hono'
import { getCookie } from 'hono/cookie'

import { PATHS } from '../../constants'
import { Bindings } from '../../local-types'
import { useLayout } from '../buildLayout'
import { COOKIES } from '../../constants'
import { redirectWithMessage } from '../../lib/redirects'

/**
 * Render the JSX for the sign-in page.
 * @param c - Hono context
 */
const renderSignIn = (c: Context, emailEntered: string) => {
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
          aria-label='Email'
        />
        <button type='submit' className='btn btn-primary' data-testid='submit'>
          Sign In
        </button>
      </form>

      <p>
        <form method='post' action={PATHS.AUTH.CANCEL_OTP}>
          <button type='submit' data-testid='cancel-sign-in-link'>
            Cancel sign in
          </button>
        </form>
      </p>
    </div>
  )
}

/**
 * Attach the sign-in route to the app.
 * @param app - Hono app instance
 */
export const buildSignIn = (app: Hono<{ Bindings: Bindings }>): void => {
  app.get(PATHS.AUTH.SIGN_IN, (c) => {
    if (
      c.env.Session != null &&
      c.env.Session.isJust &&
      c.env.Session.value.isJust &&
      c.env.Session.value.value.signedIn === true
    ) {
      console.log('Already signed in')
      return redirectWithMessage(c, PATHS.HOME, 'You are already signed in.')
    }

    const emailEntered: string = getCookie(c, COOKIES.EMAIL_ENTERED) ?? ''

    return c.render(useLayout(c, renderSignIn(c, emailEntered)))
  })
}
