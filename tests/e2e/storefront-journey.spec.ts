import { test, expect } from '@playwright/test';

test.describe('E2E: Storefront User Browsing Journey', () => {
  test('browses home -> category -> filter -> product', async ({ page }) => {
    // 1. Visit Homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/زیلاو/);

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // 2. Navigate to Category page
    await page.goto('/category/men');
    await expect(page).toHaveURL(/category\/men/);
    await expect(page.locator('h1')).toBeVisible();

    // 3. Filter products on catalog
    await page.goto('/products?inStockOnly=true');
    await expect(page).toHaveURL(/inStockOnly=true/);

    const productCards = page.locator('a[href^="/products/"]');
    await expect(productCards.first()).toBeVisible();

    // 4. Open Product Detail
    await productCards.first().click();
    await page.waitForURL(/\/products\/.+/);

    // Verify product detail elements
    await expect(page.locator('h1')).toBeVisible();
    const addToCartBtn = page.getByRole('button', { name: /افزودن به سبد خرید/i });
    await expect(addToCartBtn).toBeVisible();
    if (await addToCartBtn.isEnabled()) {
      await addToCartBtn.click();
    }
  });
});
