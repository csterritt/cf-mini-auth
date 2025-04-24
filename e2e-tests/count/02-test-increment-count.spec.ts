import { test, expect } from '@playwright/test'
import { clickLink, getElementText, verifyAlert } from '../support/finders'
import { verifyOnStartupPage } from '../support/page-verifiers'

test.describe('Count Page', () => {
  test('increments the count and shows success message', async ({ page }) => {
    // Go to home and verify
    await page.goto('http://localhost:3000/')
    await verifyOnStartupPage(page)
    await clickLink(page, 'visit-count-link')

    // Get the current count value
    const beforeText = await getElementText(page, 'count-value')
    expect(beforeText).not.toBeNull()
    const before = beforeText ? parseInt(beforeText, 10) : NaN
    expect(Number.isNaN(before)).toBe(false)

    // Click the increment button
    await clickLink(page, 'increment-count-link')

    // Should be back on the count page
    await expect(page).toHaveURL(/\/count$/)

    // The success message should appear
    await verifyAlert(page, 'Increment successful')

    // The count should be one more than before
    const afterText = await getElementText(page, 'count-value')
    expect(afterText).not.toBeNull()
    const after = afterText ? parseInt(afterText, 10) : NaN
    expect(after).toBe(before + 1)
  })
})
