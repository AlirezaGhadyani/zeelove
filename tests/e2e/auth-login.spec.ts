import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('E2E: OTP Login Flow and Protected /admin', () => {
  test.beforeAll(async () => {
    await prisma.otpChallenge.deleteMany({
      where: { mobile: '09120000000' },
    });
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('redirects unauthenticated user from /admin to /auth/login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.locator('text=ورود به زیلاو')).toBeVisible();
  });

  test('logs in as seeded super admin via dev code and reaches /admin', async ({ page }) => {
    await page.goto('/auth/login?redirect=/admin');

    // 1. Enter mobile
    await page.locator('input[type="tel"]').fill('09120000000');
    await page.locator('button:has-text("دریافت کد تایید")').click();

    // 2. Wait for code step and test-mode banner/toast
    await expect(page.locator('text=کد ۶ رقمی ارسال‌شده')).toBeVisible();
    const devBanner = page.locator('text=حالت آزمایشی');
    await expect(devBanner).toBeVisible();

    // 3. Extract the 6 digits from the dev code element
    const codeElement = page.locator('[data-testid="dev-code-value"]');
    await expect(codeElement).toBeVisible();
    const code = (await codeElement.getAttribute('data-dev-code')) || '';
    expect(code).toHaveLength(6);

    // 4. Fill digits into the 6 OTP input boxes
    for (let i = 0; i < 6; i++) {
      const input = page.locator(`input[aria-label="رقم ${i + 1}"]`);
      await input.fill(code[i]!);
    }

    // 5. Submit verification
    await page.locator('button:has-text("تایید و ورود")').click();

    // 6. Must land on protected /admin
    await expect(page).toHaveURL('/admin', { timeout: 15000 });
    await expect(page.locator('text=پنل مدیریت (God Mode)')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=SUPER_ADMIN').first()).toBeVisible();

    // 7. Test logout
    await page.locator('button:has-text("خروج از حساب")').click();
    await expect(page).toHaveURL('/auth/login');
  });
});
