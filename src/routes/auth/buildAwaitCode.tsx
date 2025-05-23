/**
 * Route builder for the await code (OTP entry) page.
 * @module routes/auth/buildAwaitCode
 */
import { Hono, Context } from 'hono'
import { getCookie } from 'hono/cookie'

import { PATHS } from '../../constants'
import { Bindings } from '../../local-types'
import { useLayout } from '../buildLayout'
import { COOKIES } from '../../constants'
import { redirectWithError, redirectWithMessage } from '../../lib/redirects'

/**
 * Render the JSX for the await code page.
 * @param c - Hono context
 */
const renderAwaitCode = (c: Context, emailEntered: string) => {
  return (
    <div data-testid='await-code-page-banner'>
      <h3>Enter Code</h3>
      <form
        method='post'
        action={PATHS.AUTH.FINISH_OTP}
        className='flex flex-col gap-4'
      >
        <input type='hidden' name='email' value={emailEntered} />
        <label htmlFor='otp' data-testid='please-enter-code-message'>
          Please enter the code sent to {emailEntered}
        </label>
        <input
          id='otp'
          name='otp'
          type='text'
          inputMode='numeric'
          pattern='[0-9]{6}'
          maxLength={6}
          minLength={6}
          placeholder='6-digit code'
          required
          className='input input-bordered'
          autoFocus
          aria-label='One-time code'
        />
        <button type='submit' className='btn btn-primary' data-testid='submit'>
          Verify Code
        </button>
      </form>

      {/* Resend code form */}
      <form method='post' action={PATHS.AUTH.RESEND_CODE} className='mt-2'>
        <input type='hidden' name='email' value={emailEntered} />
        <button
          type='submit'
          className='btn btn-secondary'
          data-testid='resend-code-button'
        >
          Resend code
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
 * Attach the await code route to the app.
 * @param app - Hono app instance
 */
export const buildAwaitCode = (app: Hono<{ Bindings: Bindings }>): void => {
  app.get(PATHS.AUTH.AWAIT_CODE, (c) => {
    if (c.env.Session == null || c.env.Session.isNothing) {
      return redirectWithError(
        c,
        PATHS.AUTH.SIGN_IN,
        'Sign in flow problem, please sign in again'
      )
    }

    if (c.env.Session.value.signedIn) {
      return redirectWithMessage(c, PATHS.HOME, 'You are already signed in.')
    }

    const emailEntered: string = getCookie(c, COOKIES.EMAIL_ENTERED) ?? ''

    return c.render(useLayout(c, renderAwaitCode(c, emailEntered)))
  })
}
