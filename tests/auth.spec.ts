import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveTitle(/Sign In/);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should show test credentials', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('Test Accounts')).toBeVisible();
    await expect(page.getByText('researcher@acm.com')).toBeVisible();
    await expect(page.getByText('manager@acm.com')).toBeVisible();
    await expect(page.getByText('admin@acm.com')).toBeVisible();
  });

  test('should login as researcher', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'researcher@acm.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/researcher/);
    await expect(page.getByText('Researcher Dashboard')).toBeVisible();
  });

  test('should login as manager', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'manager@acm.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/manager/);
    await expect(page.getByText('Manager Dashboard')).toBeVisible();
  });

  test('should login as admin', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'admin@acm.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/admin|users/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText(/Invalid credentials/i)).toBeVisible();
  });
});
