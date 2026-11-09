import type { RowLayout } from '../../domain/types/page-builder.types';

export const ZEELOVE_HOMEPAGE_ROWS: RowLayout[] = [
  {
    id: 'row-hero',
    width: 'wide',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'sm',
    alignment: 'start',
    columns: [
      {
        id: 'col-hero',
        span: 12,
        blocks: [
          {
            id: 'block-hero-1',
            type: 'hero-banner',
            schemaVersion: 1,
            props: {
              title: 'تجربه خریدی اصیل، مدرن و باوقار',
              subtitle: 'مجموعه‌ای دست‌چین از برترین برندهای پوشاک و اکسسوری ایرانی با ضمانت اصالت',
              kicker: 'فروشگاه تخصصی مد و استایل زیلاو',
              ctaText: 'مشاهده جدیدترین کالکشن',
              ctaLink: '/products',
              secondaryCtaText: 'تخفیف‌های فصل',
              secondaryCtaLink: '/products?filter=discounted',
              imageUrl: '/assets/hero/hero-fashion.jpg',
              align: 'right',
              height: 'md',
              overlayOpacity: 40,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'row-features',
    width: 'default',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'sm',
    alignment: 'start',
    columns: [
      {
        id: 'col-features',
        span: 12,
        blocks: [
          {
            id: 'block-features-1',
            type: 'features-list',
            schemaVersion: 1,
            props: {
              bordered: true,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'row-categories',
    width: 'default',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'md',
    alignment: 'start',
    columns: [
      {
        id: 'col-categories',
        span: 12,
        blocks: [
          {
            id: 'block-cat-1',
            type: 'category-tiles',
            schemaVersion: 1,
            props: {
              title: 'دسته‌بندی‌های برگزیده زیلاو',
              subtitle: 'استایل مورد علاقه خود را انتخاب کنید',
              columns: 4,
              autoFetch: true,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'row-deals',
    width: 'default',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'md',
    alignment: 'start',
    columns: [
      {
        id: 'col-deals',
        span: 12,
        blocks: [
          {
            id: 'block-deal-1',
            type: 'product-carousel',
            schemaVersion: 1,
            props: {
              title: 'پیشنهادات شگفت‌انگیز زیلاو',
              subtitle: 'تخفیف‌های ویژه روی کالکشن‌های منتخب پاییزه',
              rule: 'discounted',
              limit: 6,
              viewAllUrl: '/products?filter=discounted',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'row-banners',
    width: 'default',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'md',
    alignment: 'start',
    columns: [
      {
        id: 'col-banners',
        span: 12,
        blocks: [
          {
            id: 'block-banners-1',
            type: 'banner-grid',
            schemaVersion: 1,
            props: {
              columns: 2,
              gap: 'md',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'row-tabs',
    width: 'default',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'md',
    alignment: 'start',
    columns: [
      {
        id: 'col-tabs',
        span: 12,
        blocks: [
          {
            id: 'block-tabs-1',
            type: 'product-tabs',
            schemaVersion: 1,
            props: {
              title: 'مجموعه‌های پیشنهادی زیلاو',
              subtitle: 'بررسی محبوب‌ترین انتخاب‌ها و جدیدترین پوشاک زنانه و مردانه',
              limit: 4,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'row-featured',
    width: 'default',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'lg',
    alignment: 'start',
    columns: [
      {
        id: 'col-featured',
        span: 12,
        blocks: [
          {
            id: 'block-feat-1',
            type: 'featured-product',
            schemaVersion: 1,
            props: {
              productId: 'prod-1',
              title: 'محصول ویژه هفته: کت نیمه‌رسمی هاکوپیان',
              subtitle: 'برش اختصاصی سه‌بعدی با الیاف ۱۰۰٪ طبیعی پشم مرینوس ایتالیایی',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'row-brands',
    width: 'default',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'md',
    alignment: 'start',
    columns: [
      {
        id: 'col-brands',
        span: 12,
        blocks: [
          {
            id: 'block-brands-1',
            type: 'brand-strip',
            schemaVersion: 1,
            props: {
              title: 'برندهای رسمی و دارای ضمانت اصالت',
              subtitle: 'همکاری مستقیم با خانه‌های مد و تولیدکنندگان مطرح ایرانی',
              autoFetch: true,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'row-testimonials',
    width: 'default',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'md',
    alignment: 'start',
    columns: [
      {
        id: 'col-test',
        span: 12,
        blocks: [
          {
            id: 'block-test-1',
            type: 'testimonials',
            schemaVersion: 1,
            props: {},
          },
        ],
      },
    ],
  },
  {
    id: 'row-faq',
    width: 'default',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'md',
    alignment: 'start',
    columns: [
      {
        id: 'col-faq',
        span: 12,
        blocks: [
          {
            id: 'block-faq-1',
            type: 'faq-accordion',
            schemaVersion: 1,
            props: {},
          },
        ],
      },
    ],
  },
  {
    id: 'row-newsletter',
    width: 'default',
    columnsCount: 1,
    gap: 'none',
    paddingY: 'lg',
    alignment: 'start',
    columns: [
      {
        id: 'col-nl',
        span: 12,
        blocks: [
          {
            id: 'block-nl-1',
            type: 'newsletter-signup',
            schemaVersion: 1,
            props: {},
          },
        ],
      },
    ],
  },
];
