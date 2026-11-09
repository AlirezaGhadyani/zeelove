import type { PrismaClient } from '@prisma/client';

export async function seedNavigation(prisma: PrismaClient) {
  // 1. Header Main Navigation Menu
  const headerMenu = await prisma.navigationMenu.upsert({
    where: { code: 'header_main' },
    update: { title: 'منوی اصلی هدر' },
    create: {
      code: 'header_main',
      title: 'منوی اصلی هدر',
    },
  });

  await prisma.navigationMenuItem.deleteMany({ where: { menuId: headerMenu.id } });

  const rootItems = [
    { title: 'همه محصولات', url: '/products', displayOrder: 0 },
    { title: 'پوشاک مردانه', url: '/category/men-clothing', displayOrder: 1 },
    { title: 'پوشاک زنانه', url: '/category/women-clothing', displayOrder: 2 },
    { title: 'کفش و کیف', url: '/category/shoes-and-bags', displayOrder: 3 },
    { title: 'اکسسوری', url: '/category/accessories', displayOrder: 4 },
    { title: 'پیشنهادات ویژه', url: '/products?inStockOnly=true', displayOrder: 5 },
  ];

  for (const item of rootItems) {
    const parent = await prisma.navigationMenuItem.create({
      data: {
        menuId: headerMenu.id,
        title: item.title,
        url: item.url,
        displayOrder: item.displayOrder,
      },
    });

    if (item.url === '/category/men-clothing') {
      await prisma.navigationMenuItem.createMany({
        data: [
          { menuId: headerMenu.id, parentId: parent.id, title: 'پیراهن مردانه', url: '/category/men-shirts', displayOrder: 0 },
          { menuId: headerMenu.id, parentId: parent.id, title: 'شلوار کتان و جین', url: '/category/men-pants', displayOrder: 1 },
          { menuId: headerMenu.id, parentId: parent.id, title: 'کت و کاپشن', url: '/category/men-jackets', displayOrder: 2 },
        ],
      });
    } else if (item.url === '/category/women-clothing') {
      await prisma.navigationMenuItem.createMany({
        data: [
          { menuId: headerMenu.id, parentId: parent.id, title: 'شومیز و پیراهن', url: '/category/women-blouses', displayOrder: 0 },
          { menuId: headerMenu.id, parentId: parent.id, title: 'مانتو و پالتو', url: '/category/women-jackets', displayOrder: 1 },
          { menuId: headerMenu.id, parentId: parent.id, title: 'شلوار و دامن', url: '/category/women-pants', displayOrder: 2 },
        ],
      });
    }
  }

  // 2. Footer Menus
  const footerCategories = await prisma.navigationMenu.upsert({
    where: { code: 'footer_categories' },
    update: { title: 'دسته‌بندی‌های برگزیده' },
    create: { code: 'footer_categories', title: 'دسته‌بندی‌های برگزیده' },
  });
  await prisma.navigationMenuItem.deleteMany({ where: { menuId: footerCategories.id } });
  await prisma.navigationMenuItem.createMany({
    data: [
      { menuId: footerCategories.id, title: 'پیراهن کلاسیک مردانه', url: '/category/men-shirts', displayOrder: 0 },
      { menuId: footerCategories.id, title: 'شومیز و پوشاک زنانه', url: '/category/women-blouses', displayOrder: 1 },
      { menuId: footerCategories.id, title: 'کفش چرم طبیعی', url: '/category/shoes-and-bags', displayOrder: 2 },
      { menuId: footerCategories.id, title: 'کیف و اکسسوری هاکوپیان', url: '/category/accessories', displayOrder: 3 },
    ],
  });

  const footerSupport = await prisma.navigationMenu.upsert({
    where: { code: 'footer_support' },
    update: { title: 'خدمات مشتریان' },
    create: { code: 'footer_support', title: 'خدمات مشتریان' },
  });
  await prisma.navigationMenuItem.deleteMany({ where: { menuId: footerSupport.id } });
  await prisma.navigationMenuItem.createMany({
    data: [
      { menuId: footerSupport.id, title: 'پاسخ به پرسش‌های متداول', url: '/page/faq', displayOrder: 0 },
      { menuId: footerSupport.id, title: 'رویه‌های بازگرداندن کالا', url: '/page/returns', displayOrder: 1 },
      { menuId: footerSupport.id, title: 'راهنمای ثبت سفارش و سایزبندی', url: '/page/guide', displayOrder: 2 },
      { menuId: footerSupport.id, title: 'حریم خصوصی و قوانین خرید', url: '/page/terms', displayOrder: 3 },
    ],
  });
}
