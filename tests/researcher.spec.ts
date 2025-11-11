import { test, expect } from '@playwright/test';

test.describe('Researcher Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as researcher
    await page.goto('/login');
    await page.fill('input[type="email"]', 'researcher@acm.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/researcher/);
  });

  test('should display researcher dashboard', async ({ page }) => {
    await expect(page.getByText('Researcher Dashboard')).toBeVisible();
    await expect(page.getByText('New Research Query')).toBeVisible();
    await expect(page.getByText('Query History')).toBeVisible();
    await expect(page.getByText('Knowledge Graph')).toBeVisible();
  });

  test('should navigate to query builder', async ({ page }) => {
    await page.getByRole('link', { name: /New Research Query/i }).click();
    await expect(page).toHaveURL(/researcher\/query\/new/);
    await expect(page.getByText('Multi-Source AI-Powered Research')).toBeVisible();
  });

  test('should display query builder form', async ({ page }) => {
    await page.goto('/researcher/query/new');

    await expect(page.getByLabel(/Research Query/i)).toBeVisible();
    await expect(page.getByText('Data Sources')).toBeVisible();
    await expect(page.getByText('AI Analysis')).toBeVisible();
    await expect(page.getByRole('button', { name: /Submit Research Query/i })).toBeVisible();
  });

  test('should have default sources selected', async ({ page }) => {
    await page.goto('/researcher/query/new');

    const openAlexCheckbox = page.getByLabel(/OpenAlex/);
    const pubmedCheckbox = page.getByLabel(/PubMed/);

    await expect(openAlexCheckbox).toBeChecked();
    await expect(pubmedCheckbox).toBeChecked();
  });

  test('should have Claude selected by default', async ({ page }) => {
    await page.goto('/researcher/query/new');

    const claudeCheckbox = page.getByLabel(/Claude \(Anthropic\)/);
    await expect(claudeCheckbox).toBeChecked();
  });

  test('should validate empty query', async ({ page }) => {
    await page.goto('/researcher/query/new');

    await page.getByRole('button', { name: /Submit Research Query/i }).click();

    await expect(page.getByText(/Please enter a research query/i)).toBeVisible();
  });

  test('should navigate to query history', async ({ page }) => {
    await page.goto('/researcher');
    await page.getByRole('link', { name: /Query History/i }).click();

    await expect(page).toHaveURL(/researcher\/history/);
    await expect(page.getByText('Query History')).toBeVisible();
  });
});
