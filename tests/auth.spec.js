import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should register a new user', async ({ page }) => {
        const uniqueUsername = `user_${Date.now()}`;
        const uniqueEmail = `test_${Date.now()}@example.com`;

        await page.goto('/login');
        await page.click('text=Sign Up');

        await page.fill('input[type="text"]', uniqueUsername);
        await page.fill('input[type="email"]', uniqueEmail);
        await page.fill('input[type="password"]', 'password123');

        await page.click('button:has-text("Sign Up")');

        // Should redirect to profile
        await expect(page).toHaveURL('/profile');
        await expect(page.locator('h2')).toContainText(uniqueUsername);
        await expect(page.locator('text=' + uniqueUsername)).toBeVisible();
        await expect(page.locator('text=' + uniqueEmail)).toBeVisible();
    });

    test('should login with existing user', async ({ page }) => {
        // Assumption: User must exist. Since we don't have a guaranteed seed here in tests, 
        // we might need to register first or rely on manual seed. 
        // For robustness, let's register one first just for this test session.
        const uniqueUsername = `login_user_${Date.now()}`;
        const uniqueEmail = `login_${Date.now()}@example.com`;

        // Register first
        await page.goto('/register');
        await page.fill('input[type="text"]', uniqueUsername);
        await page.fill('input[type="email"]', uniqueEmail);
        await page.fill('input[type="password"]', 'password123');
        await page.click('button:has-text("Sign Up")');
        await expect(page).toHaveURL('/profile');

        // Logout
        await page.click('button:has-text("Logout")');
        await expect(page).toHaveURL('/login');

        // Login
        await page.fill('input[type="email"]', uniqueEmail);
        await page.fill('input[type="password"]', 'password123');
        await page.click('button:has-text("Sign In")');

        await expect(page).toHaveURL('/profile');
        await expect(page.locator('h2')).toContainText(uniqueUsername);
    });

    test('should redirect to login when accessing protected route', async ({ page }) => {
        await page.goto('/profile');
        await expect(page).toHaveURL('/login');
    });
});
