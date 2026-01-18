import { test, expect } from '@playwright/test';

test.describe('Navigation and UI Elements', () => {
    test('Home page should have search bar and main title', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1')).toContainText('Flight Manager');
        await expect(page.locator('input[placeholder="Search for flights..."]')).toBeVisible();
    });

    test('Login page should have glassmorphism aesthetics', async ({ page }) => {
        await page.goto('/login');
        const card = page.locator('.glass');
        await expect(card).toBeVisible();
        // Check for specific style if possible, or just existence of class
        await expect(card).toHaveCSS('backdrop-filter', /blur/); // Assuming glass class has backdrop-filter
    });

    test('Navigation links should work', async ({ page }) => {
        await page.goto('/');
        // Assuming there is a nav bar? 
        // Wait, looking at App.jsx, there isn't a global nav bar visible in the code snippets provided earlier.
        // It's mostly separate pages. 
        // We can verify "Don't have an account? Sign Up" link.

        await page.goto('/login');
        await page.click('text=Sign Up');
        await expect(page).toHaveURL('/register');

        await page.click('text=Log In');
        await expect(page).toHaveURL('/login');
    });
});
