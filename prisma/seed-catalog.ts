import type { PrismaClient } from '@prisma/client';

export async function seedCatalogAndInventory(prisma: PrismaClient): Promise<void> {
  // 1. Categories
  const categoriesData = [
    { id: 'cat-women', name: 'زنانه', slug: 'women', description: 'پوشاک و البسه زنانه', displayOrder: 1 },
    { id: 'cat-men', name: 'مردانه', slug: 'men', description: 'پوشاک و مد آقایان', displayOrder: 2 },
    { id: 'cat-acc', name: 'اکسسوری', slug: 'accessories', description: 'انواع اکسسوری و ملزومات مد', displayOrder: 3 },
    { id: 'cat-women-manteau', name: 'مانتو و پالتو', slug: 'women-manteau', parentId: 'cat-women', displayOrder: 1 },
    { id: 'cat-women-shirts', name: 'شومیز و پیراهن زنانه', slug: 'women-shirts', parentId: 'cat-women', displayOrder: 2 },
    { id: 'cat-women-pants', name: 'شلوار و جین زنانه', slug: 'women-pants', parentId: 'cat-women', displayOrder: 3 },
    { id: 'cat-men-shirts', name: 'پیراهن مردانه', slug: 'men-shirts', parentId: 'cat-men', displayOrder: 1 },
    { id: 'cat-men-tshirts', name: 'تیشرت و پلوشرت', slug: 'men-tshirts', parentId: 'cat-men', displayOrder: 2 },
    { id: 'cat-men-pants', name: 'شلوار کتان و جین', slug: 'men-pants', parentId: 'cat-men', displayOrder: 3 },
    { id: 'cat-men-jackets', name: 'کت و کاپشن مردانه', slug: 'men-jackets', parentId: 'cat-men', displayOrder: 4 },
    { id: 'cat-acc-watches', name: 'ساعت مچی', slug: 'watches', parentId: 'cat-acc', displayOrder: 1 },
    { id: 'cat-acc-leather', name: 'کیف و کمربند چرم', slug: 'leather-goods', parentId: 'cat-acc', displayOrder: 2 },
  ];

  for (const c of categoriesData) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: { name: c.name, slug: c.slug, description: c.description, parentId: c.parentId ?? null, displayOrder: c.displayOrder },
      create: { id: c.id, name: c.name, slug: c.slug, description: c.description, parentId: c.parentId ?? null, displayOrder: c.displayOrder, isActive: true },
    });
  }

  // 2. Brands
  const brandsData = [
    { id: 'brand-zeelove', name: 'زیلاو', slug: 'zeelove', description: 'برند اختصاصی پوشاک مدرن زیلاو', websiteUrl: 'https://zeelove.ir' },
    { id: 'brand-hacoupian', name: 'هاکوپیان', slug: 'hacoupian', description: 'برند اصیل کت و شلوار و پوشاک مردانه', websiteUrl: 'https://hacoupian.net' },
    { id: 'brand-bodyspinner', name: 'بادی اسپینر', slug: 'body-spinner', description: 'پوشاک کژوال و راحتی جوانان', websiteUrl: 'https://bodyspinner.com' },
    { id: 'brand-mashhadleather', name: 'چرم مشهد', slug: 'mashhad-leather', description: 'محصولات دست‌دوز چرم طبیعی مشهد', websiteUrl: 'https://mashhadleather.com' },
    { id: 'brand-lcman', name: 'ال‌سی من', slug: 'lc-man', description: 'پوشاک مدرن و کلاسیک شهری', websiteUrl: 'https://lc-man.com' },
    { id: 'brand-patanjameh', name: 'پاتن جامه', slug: 'patan-jameh', description: 'پوشاک اصیل ایرانی با پنبه ارگانیک', websiteUrl: 'https://patanjameh.ir' },
  ];

  for (const b of brandsData) {
    await prisma.brand.upsert({
      where: { id: b.id },
      update: { name: b.name, slug: b.slug, description: b.description, websiteUrl: b.websiteUrl },
      create: { id: b.id, name: b.name, slug: b.slug, description: b.description, websiteUrl: b.websiteUrl, isActive: true },
    });
  }

  // 3. Attributes
  const attributesData = [
    { id: 'attr-material', name: 'جنس پارچه', code: 'material', type: 'SELECT', options: ['نخ پنبه ۱۰۰٪', 'کتان ترک', 'چرم طبیعی گاو', 'پشم مرینوس', 'جین کشی'] },
    { id: 'attr-origin', name: 'کشور سازنده', code: 'country_of_origin', type: 'SELECT', options: ['ایران', 'ترکیه', 'ایتالیا'] },
    { id: 'attr-fit', name: 'قواره و برش', code: 'fit_type', type: 'SELECT', options: ['اسلیم فیت (جذب)', 'رگولار (معمولی)', 'اورسایز (آزاد)'] },
    { id: 'attr-warranty', name: 'گارانتی', code: 'warranty', type: 'SELECT', options: ['اصالت و سلامت فیزیکی', '۱۲ ماه گارانتی دوخت و چرم'] },
  ];

  for (const a of attributesData) {
    await prisma.attribute.upsert({
      where: { id: a.id },
      update: { name: a.name, code: a.code, type: a.type, options: a.options },
      create: { id: a.id, name: a.name, code: a.code, type: a.type, options: a.options },
    });
  }

  // 4. Products (~30 items)
  const productsSeed = [
    {
      id: 'prod-1',
      title: 'پیراهن آکسفورد مردانه زیلاو کلاسیک',
      slug: 'zeelove-classic-oxford-shirt',
      categoryId: 'cat-men-shirts',
      brandId: 'brand-zeelove',
      price: 680000,
      compareAtPrice: 850000,
      image: '/assets/products/shirt.svg',
      stock: 45,
      variants: [
        { sku: 'ZL-OX-WHT-M', color: 'سفید', size: 'M', price: 680000, stock: 15 },
        { sku: 'ZL-OX-WHT-L', color: 'سفید', size: 'L', price: 680000, stock: 20 },
        { sku: 'ZL-OX-BLU-L', color: 'آبی روشن', size: 'L', price: 710000, stock: 10 },
      ],
    },
    {
      id: 'prod-2',
      title: 'پیراهن کتان آستین بلند هاکوپیان',
      slug: 'hacoupian-linen-shirt-long-sleeve',
      categoryId: 'cat-men-shirts',
      brandId: 'brand-hacoupian',
      price: 1450000,
      compareAtPrice: 1750000,
      image: '/assets/products/shirt.svg',
      stock: 30,
      variants: [
        { sku: 'HAC-LN-NVY-L', color: 'سرمه‌ای', size: 'L', price: 1450000, stock: 12 },
        { sku: 'HAC-LN-NVY-XL', color: 'سرمه‌ای', size: 'XL', price: 1450000, stock: 18 },
      ],
    },
    {
      id: 'prod-3',
      title: 'تیشرت پنبه ارگانیک بادی اسپینر',
      slug: 'body-spinner-organic-cotton-tee',
      categoryId: 'cat-men-tshirts',
      brandId: 'brand-bodyspinner',
      price: 390000,
      compareAtPrice: 480000,
      image: '/assets/products/shirt.svg',
      stock: 60,
      variants: [
        { sku: 'BS-TEE-BLK-M', color: 'مشکی', size: 'M', price: 390000, stock: 25 },
        { sku: 'BS-TEE-BLK-L', color: 'مشکی', size: 'L', price: 390000, stock: 35 },
      ],
    },
    {
      id: 'prod-4',
      title: 'پلوشرت جودون پاتن جامه',
      slug: 'patan-jameh-jodon-polo-shirt',
      categoryId: 'cat-men-tshirts',
      brandId: 'brand-patanjameh',
      price: 490000,
      image: '/assets/products/shirt.svg',
      stock: 40,
      variants: [
        { sku: 'PJ-POLO-GRN-L', color: 'سبز یشمی', size: 'L', price: 490000, stock: 20 },
        { sku: 'PJ-POLO-GRN-XL', color: 'سبز یشمی', size: 'XL', price: 490000, stock: 20 },
      ],
    },
    {
      id: 'prod-5',
      title: 'شلوار کتان اسلیم فیت ال‌سی من',
      slug: 'lcman-slim-fit-chino-pants',
      categoryId: 'cat-men-pants',
      brandId: 'brand-lcman',
      price: 1150000,
      compareAtPrice: 1390000,
      image: '/assets/products/pants.svg',
      stock: 25,
      variants: [
        { sku: 'LCM-CH-BEI-32', color: 'کرم', size: '32', price: 1150000, stock: 15 },
        { sku: 'LCM-CH-BEI-34', color: 'کرم', size: '34', price: 1150000, stock: 10 },
      ],
    },
    {
      id: 'prod-6',
      title: 'شلوار جین مردانه راسته زیلاو',
      slug: 'zeelove-straight-mens-denim',
      categoryId: 'cat-men-pants',
      brandId: 'brand-zeelove',
      price: 980000,
      image: '/assets/products/pants.svg',
      stock: 35,
      variants: [
        { sku: 'ZL-JN-BLU-33', color: 'آبی تیره', size: '33', price: 980000, stock: 20 },
        { sku: 'ZL-JN-BLU-34', color: 'آبی تیره', size: '34', price: 980000, stock: 15 },
      ],
    },
    {
      id: 'prod-7',
      title: 'کت تک پشمی هاکوپیان دیپلمات',
      slug: 'hacoupian-wool-blazer-diplomat',
      categoryId: 'cat-men-jackets',
      brandId: 'brand-hacoupian',
      price: 4200000,
      compareAtPrice: 4900000,
      image: '/assets/products/jacket.svg',
      stock: 14,
      variants: [
        { sku: 'HAC-BLZ-GRY-50', color: 'طوسی ذغالی', size: '50', price: 4200000, stock: 6 },
        { sku: 'HAC-BLZ-GRY-52', color: 'طوسی ذغالی', size: '52', price: 4200000, stock: 8 },
      ],
    },
    {
      id: 'prod-8',
      title: 'کاپشن چرم طبیعی مردانه چرم مشهد',
      slug: 'mashhad-leather-mens-leather-jacket',
      categoryId: 'cat-men-jackets',
      brandId: 'brand-mashhadleather',
      price: 6500000,
      compareAtPrice: 7800000,
      image: '/assets/products/jacket.svg',
      stock: 10,
      variants: [
        { sku: 'ML-JKT-BRN-L', color: 'قهوه‌ای تیره', size: 'L', price: 6500000, stock: 5 },
        { sku: 'ML-JKT-BRN-XL', color: 'قهوه‌ای تیره', size: 'XL', price: 6500000, stock: 5 },
      ],
    },
    {
      id: 'prod-9',
      title: 'مانتو کتی شیک زنانه زیلاو بهاره',
      slug: 'zeelove-women-spring-blazer-manteau',
      categoryId: 'cat-women-manteau',
      brandId: 'brand-zeelove',
      price: 1280000,
      compareAtPrice: 1550000,
      image: '/assets/products/jacket.svg',
      stock: 30,
      variants: [
        { sku: 'ZL-MAN-BEI-38', color: 'نسکافه‌ای', size: '38', price: 1280000, stock: 15 },
        { sku: 'ZL-MAN-BEI-40', color: 'نسکافه‌ای', size: '40', price: 1280000, stock: 15 },
      ],
    },
    {
      id: 'prod-10',
      title: 'پالتو فوتر بلند زنانه ال‌سی من',
      slug: 'lcman-long-footer-women-coat',
      categoryId: 'cat-women-manteau',
      brandId: 'brand-lcman',
      price: 2900000,
      image: '/assets/products/jacket.svg',
      stock: 18,
      variants: [
        { sku: 'LCM-CT-BLK-38', color: 'مشکی', size: '38', price: 2900000, stock: 8 },
        { sku: 'LCM-CT-BLK-40', color: 'مشکی', size: '40', price: 2900000, stock: 10 },
      ],
    },
    {
      id: 'prod-11',
      title: 'شومیز حریر مجلسی زنانه زیلاو',
      slug: 'zeelove-silk-women-blouse',
      categoryId: 'cat-women-shirts',
      brandId: 'brand-zeelove',
      price: 750000,
      compareAtPrice: 920000,
      image: '/assets/products/shirt.svg',
      stock: 22,
      variants: [
        { sku: 'ZL-BLS-WHT-38', color: 'سفید صدفی', size: '38', price: 750000, stock: 10 },
        { sku: 'ZL-BLS-WHT-40', color: 'سفید صدفی', size: '40', price: 750000, stock: 12 },
      ],
    },
    {
      id: 'prod-12',
      title: 'شومیز لینن تابستانه خنک بادی اسپینر',
      slug: 'bodyspinner-summer-linen-blouse',
      categoryId: 'cat-women-shirts',
      brandId: 'brand-bodyspinner',
      price: 620000,
      image: '/assets/products/shirt.svg',
      stock: 28,
      variants: [
        { sku: 'BS-BLS-BLU-Free', color: 'آبی پاستلی', size: 'فری‌سایز', price: 620000, stock: 28 },
      ],
    },
    {
      id: 'prod-13',
      title: 'شلوار بگ پارچه‌ای زنانه شیک زیلاو',
      slug: 'zeelove-baggy-women-pants',
      categoryId: 'cat-women-pants',
      brandId: 'brand-zeelove',
      price: 820000,
      image: '/assets/products/pants.svg',
      stock: 35,
      variants: [
        { sku: 'ZL-BAG-GRY-38', color: 'طوسی', size: '38', price: 820000, stock: 20 },
        { sku: 'ZL-BAG-GRY-40', color: 'طوسی', size: '40', price: 820000, stock: 15 },
      ],
    },
    {
      id: 'prod-14',
      title: 'شلوار جین زنانه مام استایل پاتن جامه',
      slug: 'patanjameh-mom-style-women-jeans',
      categoryId: 'cat-women-pants',
      brandId: 'brand-patanjameh',
      price: 890000,
      compareAtPrice: 1050000,
      image: '/assets/products/pants.svg',
      stock: 24,
      variants: [
        { sku: 'PJ-JN-LGT-30', color: 'آبی یخی', size: '30', price: 890000, stock: 12 },
        { sku: 'PJ-JN-LGT-31', color: 'آبی یخی', size: '31', price: 890000, stock: 12 },
      ],
    },
    {
      id: 'prod-15',
      title: 'کیف دستی چرم زنانه مجلسی چرم مشهد',
      slug: 'mashhad-leather-women-handbag',
      categoryId: 'cat-acc-leather',
      brandId: 'brand-mashhadleather',
      price: 2400000,
      compareAtPrice: 2800000,
      image: '/assets/products/bag.svg',
      stock: 12,
      variants: [
        { sku: 'ML-BAG-RED', color: 'زرشکی', size: 'استاندارد', price: 2400000, stock: 12 },
      ],
    },
    {
      id: 'prod-16',
      title: 'کیف دوشی مردانه چرم مشهد اداری',
      slug: 'mashhad-leather-mens-messenger-bag',
      categoryId: 'cat-acc-leather',
      brandId: 'brand-mashhadleather',
      price: 3100000,
      image: '/assets/products/bag.svg',
      stock: 8,
      variants: [
        { sku: 'ML-BAG-BLK', color: 'مشکی', size: 'بزرگ', price: 3100000, stock: 8 },
      ],
    },
    {
      id: 'prod-17',
      title: 'کمربند چرم طبیعی دو رو هاکوپیان',
      slug: 'hacoupian-double-sided-leather-belt',
      categoryId: 'cat-acc-leather',
      brandId: 'brand-hacoupian',
      price: 850000,
      image: '/assets/products/accessory.svg',
      stock: 40,
      variants: [
        { sku: 'HAC-BLT-110', color: 'مشکی/قهوه‌ای', size: '110cm', price: 850000, stock: 40 },
      ],
    },
    {
      id: 'prod-18',
      title: 'ساعت کلاسیک عقربه‌ای چرمی زیلاو',
      slug: 'zeelove-classic-analog-watch',
      categoryId: 'cat-acc-watches',
      brandId: 'brand-zeelove',
      price: 1750000,
      compareAtPrice: 2100000,
      image: '/assets/products/accessory.svg',
      stock: 15,
      variants: [
        { sku: 'ZL-WAT-GLD', color: 'طلایی با بند چرم قهوه‌ای', size: '42mm', price: 1750000, stock: 15 },
      ],
    },
    {
      id: 'prod-19',
      title: 'کت و شلوار مجلسی رسمی هاکوپیان رویال',
      slug: 'hacoupian-royal-formal-suit',
      categoryId: 'cat-men-jackets',
      brandId: 'brand-hacoupian',
      price: 8900000,
      compareAtPrice: 10500000,
      image: '/assets/products/jacket.svg',
      stock: 8,
      variants: [
        { sku: 'HAC-SUT-BLK-50', color: 'مشکی مات', size: '50', price: 8900000, stock: 4 },
        { sku: 'HAC-SUT-BLK-52', color: 'مشکی مات', size: '52', price: 8900000, stock: 4 },
      ],
    },
    {
      id: 'prod-20',
      title: 'کفش چرم طبیعی آکسفورد مردانه زیلاو',
      slug: 'zeelove-mens-oxford-leather-shoes',
      categoryId: 'cat-acc-leather',
      brandId: 'brand-zeelove',
      price: 2100000,
      compareAtPrice: 2450000,
      image: '/assets/products/shoes.svg',
      stock: 20,
      variants: [
        { sku: 'ZL-SHO-BRN-42', color: 'عسلی', size: '42', price: 2100000, stock: 10 },
        { sku: 'ZL-SHO-BRN-43', color: 'عسلی', size: '43', price: 2100000, stock: 10 },
      ],
    },
    {
      id: 'prod-21',
      title: 'بارانی زنانه پاییزه ضدآب ال‌سی من',
      slug: 'lcman-waterproof-autumn-trenchcoat',
      categoryId: 'cat-women-manteau',
      brandId: 'brand-lcman',
      price: 2150000,
      image: '/assets/products/jacket.svg',
      stock: 16,
      variants: [
        { sku: 'LCM-TRN-BEI-38', color: 'خاکی', size: '38', price: 2150000, stock: 8 },
        { sku: 'LCM-TRN-BEI-40', color: 'خاکی', size: '40', price: 2150000, stock: 8 },
      ],
    },
    {
      id: 'prod-22',
      title: 'پیراهن چهارخانه نخی اسپرت بادی اسپینر',
      slug: 'bodyspinner-plaid-flannel-shirt',
      categoryId: 'cat-men-shirts',
      brandId: 'brand-bodyspinner',
      price: 720000,
      image: '/assets/products/shirt.svg',
      stock: 32,
      variants: [
        { sku: 'BS-PLD-RED-L', color: 'قرمز مشکی', size: 'L', price: 720000, stock: 16 },
        { sku: 'BS-PLD-RED-XL', color: 'قرمز مشکی', size: 'XL', price: 720000, stock: 16 },
      ],
    },
    {
      id: 'prod-23',
      title: 'شلوار اسلش ورزشی مردانه پاتن جامه',
      slug: 'patanjameh-mens-jogger-sweatpants',
      categoryId: 'cat-men-pants',
      brandId: 'brand-patanjameh',
      price: 580000,
      image: '/assets/products/pants.svg',
      stock: 40,
      variants: [
        { sku: 'PJ-JOG-BLK-L', color: 'مشکی', size: 'L', price: 580000, stock: 20 },
        { sku: 'PJ-JOG-BLK-XL', color: 'مشکی', size: 'XL', price: 580000, stock: 20 },
      ],
    },
    {
      id: 'prod-24',
      title: 'شومیز آستین پفی زنانه مجلسی ال‌سی من',
      slug: 'lcman-puff-sleeve-women-blouse',
      categoryId: 'cat-women-shirts',
      brandId: 'brand-lcman',
      price: 940000,
      compareAtPrice: 1100000,
      image: '/assets/products/shirt.svg',
      stock: 18,
      variants: [
        { sku: 'LCM-BLS-ROS-38', color: 'کالباسی', size: '38', price: 940000, stock: 10 },
        { sku: 'LCM-BLS-ROS-40', color: 'کالباسی', size: '40', price: 940000, stock: 8 },
      ],
    },
    {
      id: 'prod-25',
      title: 'کیف پول جیبی چرم طبیعی چرم مشهد',
      slug: 'mashhad-leather-pocket-bifold-wallet',
      categoryId: 'cat-acc-leather',
      brandId: 'brand-mashhadleather',
      price: 680000,
      image: '/assets/products/accessory.svg',
      stock: 50,
      variants: [
        { sku: 'ML-WLT-BLK', color: 'مشکی کلاسیک', size: 'استاندارد', price: 680000, stock: 50 },
      ],
    },
    {
      id: 'prod-26',
      title: 'هودی بیسیک اورسایز زیلاو پاییزه',
      slug: 'zeelove-oversized-basic-hoodie',
      categoryId: 'cat-men-tshirts',
      brandId: 'brand-zeelove',
      price: 850000,
      compareAtPrice: 990000,
      image: '/assets/products/shirt.svg',
      stock: 35,
      variants: [
        { sku: 'ZL-HOD-GRY-L', color: 'طوسی ملانژ', size: 'L', price: 850000, stock: 20 },
        { sku: 'ZL-HOD-GRY-XL', color: 'طوسی ملانژ', size: 'XL', price: 850000, stock: 15 },
      ],
    },
    {
      id: 'prod-27',
      title: 'مانتو وال خنک تابستانی زنانه پاتن جامه',
      slug: 'patanjameh-summer-voile-manteau',
      categoryId: 'cat-women-manteau',
      brandId: 'brand-patanjameh',
      price: 790000,
      image: '/assets/products/jacket.svg',
      stock: 25,
      variants: [
        { sku: 'PJ-MAN-GRN-Free', color: 'سبز نعنایی', size: 'فری‌سایز', price: 790000, stock: 25 },
      ],
    },
    {
      id: 'prod-28',
      title: 'کفش کالج چرم طبیعی زنانه چرم مشهد',
      slug: 'mashhad-leather-women-loafer-shoes',
      categoryId: 'cat-acc-leather',
      brandId: 'brand-mashhadleather',
      price: 1950000,
      image: '/assets/products/shoes.svg',
      stock: 15,
      variants: [
        { sku: 'ML-LOA-BLK-38', color: 'مشکی', size: '38', price: 1950000, stock: 8 },
        { sku: 'ML-LOA-BLK-39', color: 'مشکی', size: '39', price: 1950000, stock: 7 },
      ],
    },
    {
      id: 'prod-29',
      title: 'تیشرت یقه کوبایی آستین کوتاه زیلاو',
      slug: 'zeelove-cuban-collar-short-sleeve-tee',
      categoryId: 'cat-men-tshirts',
      brandId: 'brand-zeelove',
      price: 490000,
      image: '/assets/products/shirt.svg',
      stock: 30,
      variants: [
        { sku: 'ZL-CUB-BEI-L', color: 'کرم نسکافه‌ای', size: 'L', price: 490000, stock: 15 },
        { sku: 'ZL-CUB-BEI-XL', color: 'کرم نسکافه‌ای', size: 'XL', price: 490000, stock: 15 },
      ],
    },
    {
      id: 'prod-30',
      title: 'کت اسپرت کتان مردانه بهاره ال‌سی من',
      slug: 'lcman-cotton-casual-spring-blazer',
      categoryId: 'cat-men-jackets',
      brandId: 'brand-lcman',
      price: 3400000,
      compareAtPrice: 3950000,
      image: '/assets/products/jacket.svg',
      stock: 12,
      variants: [
        { sku: 'LCM-BLZ-NVY-50', color: 'سرمه‌ای روشن', size: '50', price: 3400000, stock: 6 },
        { sku: 'LCM-BLZ-NVY-52', color: 'سرمه‌ای روشن', size: '52', price: 3400000, stock: 6 },
      ],
    },
  ];

  for (const item of productsSeed) {
    const product = await prisma.product.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        slug: item.slug,
        categoryId: item.categoryId,
        brandId: item.brandId,
        status: 'ACTIVE',
        description: `محصول اورجینال و باکیفیت ${item.title} از برند معتبر در زیلاو. طراحی شده با جدیدترین ترندهای مد و متریال درجه یک.`,
        shortDescription: `خرید اینترنتی ${item.title} با تضمین بهترین قیمت و ارسال سریع.`,
        seo: { metaTitle: `${item.title} | زیلاو`, metaDescription: `خرید آنلاین ${item.title} با تخفیف و تحویل فوری در سراسر کشور.` },
      },
      create: {
        id: item.id,
        title: item.title,
        slug: item.slug,
        categoryId: item.categoryId,
        brandId: item.brandId,
        status: 'ACTIVE',
        description: `محصول اورجینال و باکیفیت ${item.title} از برند معتبر در زیلاو. طراحی شده با جدیدترین ترندهای مد و متریال درجه یک.`,
        shortDescription: `خرید اینترنتی ${item.title} با تضمین بهترین قیمت و ارسال سریع.`,
        seo: { metaTitle: `${item.title} | زیلاو`, metaDescription: `خرید آنلاین ${item.title} با تخفیف و تحویل فوری در سراسر کشور.` },
      },
    });

    // Images
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        id: `img-${item.id}-1`,
        productId: product.id,
        url: item.image,
        altText: item.title,
        isMain: true,
        displayOrder: 0,
      },
    });

    // Variants and Inventory
    for (let i = 0; i < item.variants.length; i++) {
      const v = item.variants[i]!;
      const variant = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          price: v.price,
          compareAtPrice: item.compareAtPrice ?? null,
          isDefault: i === 0,
          options: { رنگ: v.color, سایز: v.size },
        },
        create: {
          id: `var-${item.id}-${i + 1}`,
          productId: product.id,
          sku: v.sku,
          price: v.price,
          compareAtPrice: item.compareAtPrice ?? null,
          isDefault: i === 0,
          options: { رنگ: v.color, سایز: v.size },
        },
      });

      await prisma.inventoryLevel.upsert({
        where: { variantId: variant.id },
        update: { quantity: v.stock, safetyStock: 2 },
        create: {
          id: `inv-${variant.id}`,
          variantId: variant.id,
          quantity: v.stock,
          safetyStock: 2,
        },
      });
    }

    // Attributes
    await prisma.productAttributeValue.deleteMany({ where: { productId: product.id } });
    await prisma.productAttributeValue.createMany({
      data: [
        { id: `pav-${item.id}-1`, productId: product.id, attributeId: 'attr-material', value: 'نخ پنبه ۱۰۰٪' },
        { id: `pav-${item.id}-2`, productId: product.id, attributeId: 'attr-origin', value: 'ایران' },
        { id: `pav-${item.id}-3`, productId: product.id, attributeId: 'attr-warranty', value: 'اصالت و سلامت فیزیکی' },
      ],
    });
  }
}
