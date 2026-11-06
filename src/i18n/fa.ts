export const faDictionary = {
  common: {
    appName: 'زیلاو',
    appSubtitle: 'پلتفرم فروشگاهی و تحریریه گاد مود',
    save: 'ذخیره',
    cancel: 'انصراف',
    delete: 'حذف',
    edit: 'ویرایش',
    back: 'بازگشت',
    close: 'بستن',
    search: 'جستجو...',
    loading: 'در حال بارگذاری...',
    retry: 'تلاش مجدد',
    submit: 'ثبت و ارسال',
    success: 'عملیات با موفقیت انجام شد',
    error: 'خطایی رخ داد',
  },
  nav: {
    home: 'صفحه اصلی',
    catalog: 'محصولات',
    cart: 'سبد خرید',
    orders: 'سفارش‌ها',
    settings: 'تنظیمات',
    admin: 'پنل مدیریت',
  },
  commerce: {
    price: 'قیمت',
    toman: 'تومان',
    addToCart: 'افزودن به سبد',
    inStock: 'موجود در انبار',
    outOfStock: 'ناموجود',
    lowStock: 'تنها {count} عدد باقی‌مانده',
    discount: 'تخفیف',
    quantity: 'تعداد',
    orderTotal: 'مبلغ کل سفارش',
    rating: 'امتیاز',
  },
  errors: {
    generic: 'خطای غیرمنتظره در سامانه',
    notFound: 'محتوای مورد نظر یافت نشد',
    networkError: 'عدم برقراری ارتباط با سرور',
  },
  designSystem: {
    title: 'سیستم دیزاین زیلاو (RTL)',
    subtitle: 'کتابخانه کامپوننت‌ها و توکن‌های پایه‌ای راست‌چین با پالت اختصاصی زعفرانی',
    tokens: 'توکن‌های طراحی و رنگ‌ها',
    primitives: 'کامپوننت‌های پایه‌ای (UI Primitives)',
    commerce: 'کامپوننت‌های تجارت الکترونیک',
    lightMode: 'حالت روشن',
    darkMode: 'حالت تاریک',
  },
} as const;

export type Dictionary = typeof faDictionary;
export type TranslationKey =
  | `common.${keyof Dictionary['common']}`
  | `nav.${keyof Dictionary['nav']}`
  | `commerce.${keyof Dictionary['commerce']}`
  | `errors.${keyof Dictionary['errors']}`
  | `designSystem.${keyof Dictionary['designSystem']}`;
