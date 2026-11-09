import { Result, ok, err } from '@/shared/kernel/result';
import type { NewsletterRepositoryPort } from '../ports/newsletter.repository.port';

export interface SubscribeNewsletterInput {
  identifier: string; // phone or email
  source?: string;
}

export class SubscribeNewsletterUseCase {
  constructor(private readonly newsletterRepo: NewsletterRepositoryPort) {}

  public async execute(
    input: SubscribeNewsletterInput,
  ): Promise<Result<{ message: string }, string>> {
    const raw = input.identifier.trim();
    if (!raw) {
      return err('شماره موبایل یا ایمیل را وارد کنید');
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
    const isMobile = /^09\d{9}$/.test(raw.replace(/\D/g, ''));

    if (!isEmail && !isMobile) {
      return err('لطفاً یک شماره موبایل معتبر (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) یا ایمیل صحیح وارد نمایید');
    }

    const exists = await this.newsletterRepo.isSubscribed(raw);
    if (exists) {
      return ok({ message: 'این نشانی پیش‌تر در خبرنامه زیلاو ثبت شده است' });
    }

    await this.newsletterRepo.subscribe({
      email: isEmail ? raw.toLowerCase() : undefined,
      mobile: isMobile ? raw.replace(/\D/g, '') : undefined,
      source: input.source || 'storefront_block',
    });

    return ok({ message: 'عضویت شما در خبرنامه زیلاو با موفقیت انجام شد' });
  }
}
