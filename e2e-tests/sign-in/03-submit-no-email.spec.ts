import { test } from '@playwright/test'

import { submitInvalidEmail } from '../support/auth-helpers'

import { verifyOnStartupPage } from '../support/page-verifiers'
import { startSignIn } from '../support/auth-helpers'
import { clickLink, fillInput, verifyAlert } from '../support/finders'

test('submitting no email fails', async ({ page }) => {
  // Navigate to startup page and verify
  await page.goto('http://localhost:3000/')
  await verifyOnStartupPage(page)
  await startSignIn(page)

  // Submit empty email and verify still on the sign in page
  await submitInvalidEmail(page, '')
})
