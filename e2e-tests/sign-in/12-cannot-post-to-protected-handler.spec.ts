import { test, expect } from '@playwright/test'

test('cannot post directly to protected handler', async ({ request }) => {
  // Attempt to POST directly to the protected handler
  const response = await request.post('http://localhost:3000/increment', {
    failOnStatusCode: false, // Prevent Playwright from throwing on non-2xx status
  })

  // It appears that hono/Cloudflare pages auto-follows redirects for the client,
  // so we can't verify the redirect status code
  // expect(response.status()).toBe(303)

  // Verify the redirect is to the sign-in page
  const body = await response.text()
  expect(body).toContain('sign-in-page-banner')
})
