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

  // Auth API paths
  AUTH: {
    // Base path for Better Auth API
    API_BASE: '/api/auth',

    // Sign in page
    SIGN_IN: '/auth/sign-in',

    // Start OTP verification process
    START_OTP: '/auth/start-otp',

    // Finish OTP verification process
    FINISH_OTP: '/auth/finish-otp',

    // Await code page
    AWAIT_CODE: '/auth/await-code',

    // Cancel OTP verification
    CANCEL_OTP: '/auth/cancel-otp',

    // Resend OTP code
    RESEND_CODE: '/auth/resend-code',

    // Sign out
    SIGN_OUT: '/auth/sign-out',
  },
} as const

// Check if we're in production (for cookie security)
// Using process.env.NODE_ENV as a more standard approach
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Cookie names
export const COOKIES = {
  // Oridnary message cookie
  MESSAGE_FOUND: 'MESSAGE_FOUND',
  // Error message cookie
  ERROR_FOUND: 'ERROR_FOUND',
  // Email entered cookie
  EMAIL_ENTERED: 'EMAIL_ENTERED',
  // OTP setup timestamp cookie (encrypted)
  OTP_SETUP: 'OTP_SETUP',
  // Session cookie
  SESSION: 'better-auth.session_token',
  // Standard cookie options
  STANDARD_COOKIE_OPTIONS: {
    path: '/',
    httpOnly: true,
    secure: IS_PRODUCTION,
  },
} as const

// Validation patterns
export const VALIDATION = {
  // Email validation regex
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
} as const
