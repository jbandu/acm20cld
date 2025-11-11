import { test, expect } from '@playwright/test';

test.describe('Manager Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.fill('input[type="email"]', 'manager@acm.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/manager/);
  });

  test('should display manager dashboard', async ({ page }) => {
    await expect(page.getByText('Manager Dashboard')).toBeVisible();
    await expect(page.getByText('Team Activity')).toBeVisible();
    await expect(page.getByText('Analytics')).toBeVisible();
    await expect(page.getByText('Knowledge Contributions')).toBeVisible();
  });

  test('should navigate to team activity', async ({ page }) => {
    await page.getByRole('link', { name: /Team Activity/i }).click();
    await expect(page).toHaveURL(/manager\/team-activity/);
    await expect(page.getByText('Team Activity')).toBeVisible();
    await expect(page.getByText('Team Members')).toBeVisible();
  });

  test('should navigate to analytics', async ({ page }) => {
    await page.getByRole('link', { name: /Analytics/i }).click();
    await expect(page).toHaveURL(/manager\/analytics/);
    await expect(page.getByText('Analytics Dashboard')).toBeVisible();
    await expect(page.getByText('Key Metrics')).toBeVisible();
  });

  test('should navigate to knowledge contributions', async ({ page }) => {
    await page.getByRole('link', { name: /Knowledge Contributions/i }).click();
    await expect(page).toHaveURL(/manager\/knowledge-contributions/);
    await expect(page.getByText('Knowledge Contributions')).toBeVisible();
  });

  test('should display analytics metrics', async ({ page }) => {
    await page.goto('/manager/analytics');

    await expect(page.getByText('Total Queries')).toBeVisible();
    await expect(page.getByText('Success Rate')).toBeVisible();
    await expect(page.getByText('Avg Responses')).toBeVisible();
    await expect(page.getByText('Total Feedback')).toBeVisible();
  });
});
