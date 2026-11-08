import { describe, it, expect } from 'vitest';
import { Slug, normalizePersianText } from '@/modules/catalog/domain/value-objects/slug.vo';

describe('Slug Value Object & Persian Normalization', () => {
  it('normalizes Arabic characters to Persian and replaces spaces with hyphens', () => {
    const raw = 'پیراهن كلاسيك مردانه يقه گرد';
    const slugRes = Slug.create(raw);
    expect(slugRes.isOk).toBe(true);
    if (!slugRes.isOk) return;

    // Notice ك is converted to ک, and ي is converted to ی
    expect(slugRes.value.value).toContain('کلاسیک');
    expect(slugRes.value.value).toBe('پیراهن-کلاسیک-مردانه-یقه-گرد');
  });

  it('normalizes ZWNJ and trims duplicate hyphens', () => {
    const raw = 'کت\u200cوشلوار   رسمی___مشکی---';
    const slugRes = Slug.create(raw);
    expect(slugRes.isOk).toBe(true);
    if (!slugRes.isOk) return;

    expect(slugRes.value.value).toBe('کت-وشلوار-رسمی-مشکی');
  });

  it('normalizes Persian/Arabic digits to ASCII digits', () => {
    const raw = 'تیشرت مدل ۱۴۰۳ تابستانه';
    const slugRes = Slug.create(raw);
    expect(slugRes.isOk).toBe(true);
    if (!slugRes.isOk) return;

    expect(slugRes.value.value).toBe('تیشرت-مدل-1403-تابستانه');
  });

  it('rejects empty or whitespace-only strings', () => {
    expect(Slug.create('').isErr).toBe(true);
    expect(Slug.create('   ').isErr).toBe(true);
    expect(Slug.create('!@#$%^&*()').isErr).toBe(true);
  });

  it('provides helper normalizePersianText for strings', () => {
    const norm = normalizePersianText('كتابخانه يادداشت\u200cها');
    expect(norm).toContain('کتابخانه');
    expect(norm).toContain('یادداشت-ها');
  });
});
