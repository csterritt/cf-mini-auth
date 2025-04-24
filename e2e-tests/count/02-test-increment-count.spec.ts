import { test, expect } from '@playwright/test'
import { clickLink, verifyAlert } from '../support/finders'

test.describe('Count Page', () => {
  test('increments the count and shows success message', async ({ page }) => {
    // Go to home and click the count link
    await page.goto('http://localhost:3000/')
    await clickLink(page, 'visit-count-link')

    // Get the current count value
    const countText = await page.textContent('p:has-text("Current value:")')
    const match = countText?.match(/Current value: (\d+)/)
    expect(match).not.toBeNull()
    const before = match ? parseInt(match[1], 10) : NaN
    expect(Number.isNaN(before)).toBe(false)

    // Click the increment button
    await clickLink(page, 'increment-count-link')

    // Should be back on the count page
    await expect(page).toHaveURL(/\/count$/)

    // The success message should appear
    await verifyAlert(page, 'Increment successful')

    // The count should be one more than before
    const afterText = await page.textContent('p:has-text("Current value:")')
    const afterMatch = afterText?.match(/Current value: (\d+)/)
    expect(afterMatch).not.toBeNull()
    const after = afterMatch ? parseInt(afterMatch[1], 10) : NaN
    expect(after).toBe(before + 1)
  })
})
