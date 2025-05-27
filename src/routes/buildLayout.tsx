/**
 * Provides a layout wrapper for TSX content.
 * @module routes/buildLayout
 */
import { Context } from 'hono'
import { getCookie, deleteCookie } from 'hono/cookie'

import { COOKIES, PATHS } from '../constants'
import { version } from '../version'

/**
 * Wraps children in a standard layout.
 * @param props - The content to render inside the layout
 * @returns TSX element with layout
 */
export function useLayout(c: Context, children: any) {
  // Check for message cookie
  const message = getCookie(c, COOKIES.MESSAGE_FOUND)
  if (message) {
    deleteCookie(c, COOKIES.MESSAGE_FOUND, { path: '/' })
  }

  // Check for error cookie
  const errorMessage = getCookie(c, COOKIES.ERROR_FOUND)
  if (errorMessage) {
    deleteCookie(c, COOKIES.ERROR_FOUND, { path: '/' })
  }

  return (
    <main>
      <header>
        <h3>CF Mini Auth Demo</h3>

        {c.env.Session.isNothing && (
          <p>
            <a href={PATHS.AUTH.SIGN_IN} data-testid='sign-in-link'>
              Sign in
            </a>
          </p>
        )}

        {c.env.Session.isJust && (
          <p>
            <form method='post' action={PATHS.AUTH.SIGN_OUT}>
              <button type='submit' data-testid='sign-out-link'>
                Sign out
              </button>
            </form>
          </p>
        )}
      </header>

      {message && (
        <div style={{ color: 'green', marginBottom: '15px' }} role='alert'>
          {message}
        </div>
      )}

      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '15px' }} role='alert'>
          {errorMessage}
        </div>
      )}

      {children}

      <footer>
        <div>Copyright &copy; 2025 V{version}</div>
      </footer>
    </main>
  )
}
