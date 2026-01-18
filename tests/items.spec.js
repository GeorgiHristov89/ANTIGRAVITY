import { test, expect } from '@playwright/test';

test.describe('Item Management', () => {
    test('should add a new item and search for it', async ({ page }) => {
        const uniqueItemName = `Item_${Date.now()}`;
        const uniqueItemDesc = `Description for ${uniqueItemName}`;

        await page.goto('/');

        // Fill Add Item form
        await page.getByLabel('Item Name').fill(uniqueItemName);
        await page.getByLabel('Description').fill(uniqueItemDesc);

        await page.click('button:has-text("Add Item")');

        // Verify success message
        await expect(page.locator('text=Item added successfully!')).toBeVisible();

        // Search for the new item
        await page.fill('input[placeholder="Search for flights..."]', uniqueItemName);
        await page.click('button:has-text("Search")');

        // Verify result
        await expect(page.locator('h3', { hasText: uniqueItemName })).toBeVisible();
        await expect(page.locator('p', { hasText: uniqueItemDesc })).toBeVisible();
    });
});
