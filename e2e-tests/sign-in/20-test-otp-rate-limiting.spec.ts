import { test, expect } from '@playwright/test'
import {
  verifyOnStartupPage,
  verifyOnSignInPage,
} from '../support/page-verifiers'
import { startSignIn } from '../support/auth-helpers'

// This test verifies that the handleStartOtp endpoint has rate limiting
// It should return a 429 error if called more than three times in a five minute period

test.describe('OTP Rate Limiting', () => {
  test('limits OTP requests to 3 per 5 minutes for the same email', async ({
    page,
    request,
  }) => {
    // Navigate to startup page and verify
    await page.goto('http://localhost:3000/')
    await verifyOnStartupPage(page)

    // Start sign in process
    await startSignIn(page)
    await verifyOnSignInPage(page)

    const testEmail = 'fredfred@team439980.testinator.com'

    // Reset rate limiting for this email before starting the test
    await request.post(
      `http://localhost:3000/auth/start-otp?reset-rate-limit=true`,
      {
        form: {
          email: testEmail,
        },
        headers: {
          'Origin': 'http://localhost:3000',
        },
        maxRedirects: 0,
      }
    )

    // Function to submit the email and get the response
    async function submitEmailAndGetResponse() {
      const response = await request.post(
        'http://localhost:3000/auth/start-otp?rate-limit-test=true',
        {
          form: {
            email: testEmail,
          },
          headers: {
            // Set the Origin header to match the allowed origin in the CSRF middleware
            'Origin': 'http://localhost:3000',
          },
          failOnStatusCode: false, // Don't fail the test on non-2xx status codes
          maxRedirects: 0, // Don't follow redirects so we can check the status
        }
      )
      return response
    }

    // First three requests should succeed (status 303 - See Other)
    for (let i = 0; i < 3; i++) {
      const response = await submitEmailAndGetResponse()
      expect(response.status()).toBe(303) // Redirect status
      console.log(`Request ${i + 1}: Status ${response.status()}`)
    }

    // Fourth request should be rate limited (status 429 - Too Many Requests)
    const rateLimitedResponse = await submitEmailAndGetResponse()
    expect(rateLimitedResponse.status()).toBe(429) // Too Many Requests
    console.log(`Request 4: Status ${rateLimitedResponse.status()}`)

    // Verify the response contains a message about rate limiting
    const responseBody = await rateLimitedResponse.text()
    expect(responseBody).toContain('rate limit')

    // Optional: Verify the Retry-After header exists
    const retryAfter = rateLimitedResponse.headers()['retry-after']
    expect(retryAfter).toBeTruthy()
  })

  test('different email addresses are not affected by rate limiting of other emails', async ({
    request,
  }) => {
    const firstEmail = 'fredfred@team439980.testinator.com'
    const secondEmail = 'fredfred2@team439980.testinator.com'
    
    // Reset rate limiting for both emails before starting the test
    await request.post(
      `http://localhost:3000/auth/start-otp?reset-rate-limit=true`,
      {
        form: {
          email: firstEmail,
        },
        headers: {
          'Origin': 'http://localhost:3000',
        },
        maxRedirects: 0,
      }
    )
    
    await request.post(
      `http://localhost:3000/auth/start-otp?reset-rate-limit=true`,
      {
        form: {
          email: secondEmail,
        },
        headers: {
          'Origin': 'http://localhost:3000',
        },
        maxRedirects: 0,
      }
    )

    // Function to submit the email and get the response
    async function submitEmailAndGetResponse(email: string) {
      const response = await request.post(
        'http://localhost:3000/auth/start-otp?rate-limit-test=true',
        {
          form: {
            email: email,
          },
          headers: {
            // Set the Origin header to match the allowed origin in the CSRF middleware
            'Origin': 'http://localhost:3000',
          },
          failOnStatusCode: false,
          maxRedirects: 0,
        }
      )
      return response
    }

    // Submit 3 requests with the first email
    for (let i = 0; i < 3; i++) {
      await submitEmailAndGetResponse(firstEmail)
    }

    // Fourth request with first email should be rate limited
    const rateLimitedResponse = await submitEmailAndGetResponse(firstEmail)
    expect(rateLimitedResponse.status()).toBe(429)

    // But a request with a different email should still succeed
    const differentEmailResponse = await submitEmailAndGetResponse(secondEmail)
    expect(differentEmailResponse.status()).toBe(303) // Should redirect, not be rate limited
  })
})
