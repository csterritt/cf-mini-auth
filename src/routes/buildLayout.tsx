/**
 * Provides a layout wrapper for TSX content.
 * @module routes/buildLayout
 */
import { Context } from 'hono'
import { getCookie, deleteCookie } from 'hono/cookie'

import { COOKIES } from '../constants'

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
    </main>
  )
}
