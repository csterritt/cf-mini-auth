import { test, expect } from '@playwright/test'
import {
  signOutAndVerify,
  startSignIn,
  submitEmail,
  submitValidCode,
} from '../support/auth-helpers'
import { verifyOnStartupPage } from '../support/page-verifiers'
import { HTML_STATUS } from '../../src/constants'

test.describe('Body size limit', () => {
  test('returns 413 status when payload exceeds size limit', async ({
    page,
    request,
  }) => {
    // First sign in to get a valid session
    await page.goto('http://localhost:3000/')
    await verifyOnStartupPage(page)
    await startSignIn(page)

    // Submit known email and valid code to authenticate
    await submitEmail(page, 'fredfred@team439980.testinator.com')
    await submitValidCode(page, '123456')

    // Create a large payload (2KB)
    const largePayload = { data: 'X'.repeat(2000) }

    // Attempt to POST to the increment endpoint with the large payload
    const response = await request.post('http://localhost:3000/increment', {
      data: largePayload,
      headers: {
        // Set the Origin header to match the allowed origin in the CSRF middleware
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json',
      },
      failOnStatusCode: false, // Don't fail the test on non-2xx status codes
    })

    // Verify the response status is 413 Content Too Large
    expect(response.status()).toBe(HTML_STATUS.CONTENT_TOO_LARGE)
    
    // Verify the response contains the overflow error message
    const responseText = await response.text()
    expect(responseText).toContain('overflow :(')

    // Sign out to clean up the authenticated session
    await signOutAndVerify(page)
  })
})
