import { test } from '@playwright/test'

import { verifyOnStartupPage } from '../support/page-verifiers'
import {
  startSignIn,
  submitEmail,
  submitExpiredCode,
  cancelSignIn,
} from '../support/auth-helpers'
import { readOtpCode } from '../support/read-otp-code'

test('submitting an expired code shows token expired error', async ({
  page,
}) => {
  try {
    // Set the clock to sixteen minutes ago
    const ago = Date.now() - 16 * 60 * 1000
    await page.goto(`http://localhost:3000/auth/set-clock/${ago}`)

    // Navigate to startup page and verify
    await page.goto('http://localhost:3000/')
    await verifyOnStartupPage(page)
    await startSignIn(page)

    // Submit known email and verify success
    await submitEmail(page, 'fredfred@team439980.testinator.com')

    // Read the first OTP code using our retry mechanism
    const firstCode = await readOtpCode()
    console.log('First code:', firstCode)

    // Move the clock forward to make the code expired
    await page.goto(`http://localhost:3000/auth/reset-clock`)
    await page.goto('http://localhost:3000/auth/await-code')

    // Submit expired code and verify error
    await submitExpiredCode(page, firstCode)

    // Cancel to reset internal state
    await cancelSignIn(page)
  } finally {
    // Reset the clock
    await page.goto(`http://localhost:3000/auth/reset-clock`)
  }
})
