/**
 * Path constants for the application.
 * @module constants
 */

/**
 * All HTML status codes used in the app.
 * @readonly
 */
export const HTML_STATUS = {
  SEE_OTHER: 303 as const,
} as const

/**
 * All route paths used in the app.
 * @readonly
 */
export const PATHS = {
  HOME: '/' as const,
  PRIVATE: '/private' as const,
  COUNT: '/count' as const,
  INCREMENT: '/increment' as const,
} as const
