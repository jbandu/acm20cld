import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@acm.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/admin|users/);
  });

  test('should display admin panel', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByText('User Management')).toBeVisible();
    await expect(page.getByText('All Users')).toBeVisible();
  });

  test('should show user statistics', async ({ page }) => {
    await page.goto('/admin/users');

    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByText('Researchers')).toBeVisible();
    await expect(page.getByText('Managers')).toBeVisible();
    await expect(page.getByText('Admins')).toBeVisible();
  });

  test('should display all test users', async ({ page }) => {
    await page.goto('/admin/users');

    await expect(page.getByText('researcher@acm.com')).toBeVisible();
    await expect(page.getByText('manager@acm.com')).toBeVisible();
    await expect(page.getByText('admin@acm.com')).toBeVisible();
  });

  test('should navigate to data sources', async ({ page }) => {
    await page.goto('/admin/sources');

    await expect(page.getByText('Data Sources')).toBeVisible();
    await expect(page.getByText('Built-in Data Sources')).toBeVisible();
    await expect(page.getByText('OpenAlex')).toBeVisible();
    await expect(page.getByText('PubMed')).toBeVisible();
  });

  test('should navigate to system configuration', async ({ page }) => {
    await page.goto('/admin/system');

    await expect(page.getByText('System Configuration')).toBeVisible();
    await expect(page.getByText('System Health')).toBeVisible();
    await expect(page.getByText('API Integrations')).toBeVisible();
  });

  test('should show system health status', async ({ page }) => {
    await page.goto('/admin/system');

    await expect(page.getByText('Database')).toBeVisible();
    await expect(page.getByText('Redis Cache')).toBeVisible();
    await expect(page.getByText('Neo4j')).toBeVisible();
  });
});
