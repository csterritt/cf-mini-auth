import { test, expect } from '@playwright/test'

import { clickLink } from '../support/finders'

// This test verifies that the count page displays a numeric count value

test.describe('Count Page', () => {
  test('shows a numeric value for the count', async ({ page }) => {
    // Navigate to startup page and verify
    await page.goto('http://localhost:3000/')
    await clickLink(page, 'visit-count-link')
    // Find the element that displays the count value
    const countText = await page.textContent('p:has-text("Current value:")')
    // Extract the value after the colon
    const match = countText?.match(/Current value: (.+)/)
    expect(match).not.toBeNull()
    const value = match && match[1]
    // Should be a number (not NaN, not empty)
    expect(value).toMatch(/^\d+$/)
  })
})
