import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('E2E: Product Creation in Admin & Query via Read API', () => {
  const adminMobile = process.env.SEED_SUPER_ADMIN_MOBILE || '09120000000';
  const testProductSlug = 'e2e-test-linen-trousers';

  test.beforeAll(async () => {
    try {
      await prisma.product.deleteMany({ where: { slug: testProductSlug } });
    } catch {
      // offline safe
    }
  });

  test.afterAll(async () => {
    try {
      await prisma.product.deleteMany({ where: { slug: testProductSlug } });
      await prisma.$disconnect();
    } catch {
      // safe cleanup
    }
  });

  test('creates a product with variants and images in admin and queries it through the read API', async ({
    page,
    request,
  }) => {
    // 1. Login as Super Admin
    await page.goto('/auth/login?redirect=/admin/products');
    await page.locator('input[type="tel"]').fill(adminMobile);
    await page.locator('button:has-text("دریافت کد تایید")').click();

    await expect(page.locator('text=کد ۶ رقمی ارسال‌شده')).toBeVisible();
    const codeElement = page.locator('[data-testid="dev-code-value"]');
    await expect(codeElement).toBeVisible();
    const code = (await codeElement.getAttribute('data-dev-code')) || '';
    expect(code).toHaveLength(6);

    for (let i = 0; i < 6; i++) {
      const input = page.locator(`input[aria-label="رقم ${i + 1}"]`);
      await input.fill(code[i]!);
    }
    await page.locator('button:has-text("تایید و ورود")').click();

    // 2. Lands on /admin/products
    await expect(page).toHaveURL(/\/admin\/products/, { timeout: 15000 });
    await expect(page.locator('text=مدیریت محصولات')).toBeVisible();

    // 3. Open product creator modal
    await page.locator('button:has-text("افزودن محصول جدید")').click();
    await expect(page.locator('text=ایجاد محصول جدید')).toBeVisible();

    // 4. Fill General Info
    const testTitle = 'شلوار لینن خنک آزمایشی زیلاو';
    await page.locator('input[placeholder*="مثال: پیراهن"]').fill(testTitle);
    await page.locator('input[placeholder="men-linen-shirt"]').fill(testProductSlug);
    await page.locator('select:has-text("پیش‌نویس (DRAFT)")').selectOption('ACTIVE');

    // 5. Fill Pricing Tab
    await page.locator('button:has-text("قیمت‌گذاری")').click();
    const priceInput = page.locator('input[type="number"]').first();
    await priceInput.fill('490000');

    // 6. Fill Variants Tab
    await page.locator('button:has-text("تنوع‌ها و موجودی")').click();
    await expect(page.locator('text=لیست تنوع‌های رنگ و سایز')).toBeVisible();

    // 7. Submit Product
    await page.locator('button:has-text("ذخیره محصول")').click();

    // 8. Assert table displays the newly created product
    await expect(page.locator(`text=${testTitle}`)).toBeVisible({ timeout: 15000 });

    // 9. DONE WHEN: Query through read API
    const res = await request.get(`/api/catalog/products/${testProductSlug}`);
    expect(res.status()).toBe(200);

    const json = await res.json();
    expect(json.slug).toBe(testProductSlug);
    expect(json.title).toBe(testTitle);
    expect(json.status).toBe('ACTIVE');
    expect(json.variants.length).toBeGreaterThanOrEqual(1);
    expect(json.variants[0].priceToman).toBe(490000);
    expect(json.images.length).toBeGreaterThanOrEqual(1);
  });
});
