import React from 'react';
import type { Metadata } from 'next';
import { appContainer } from '@/shared/infrastructure/container/app-container';
import { CONTENT_TOKENS } from '@/modules/content/infrastructure/container/register-content';
import { StorefrontShell } from '@/components/storefront/storefront-shell';
import { PageRenderer } from '@/modules/content/rendering/page-renderer';
import { ZEELOVE_HOMEPAGE_ROWS } from '@/modules/content/infrastructure/seed/homepage-seed';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const getPage = appContainer.resolve(CONTENT_TOKENS.GetPageUseCase);
  const res = await getPage.execute({ type: 'home' });

  const title = res.isOk && res.value.page.seo?.metaTitle
    ? res.value.page.seo.metaTitle
    : 'زیلاو | فروشگاه آنلاین مد و استایل اصیل';

  const description = res.isOk && res.value.page.seo?.metaDescription
    ? res.value.page.seo.metaDescription
    : 'خرید انواع پوشاک و اکسسوری از برترین برندهای اصیل ایرانی';

  return {
    title,
    description,
  };
}

export default async function HomePage() {
  const getPage = appContainer.resolve(CONTENT_TOKENS.GetPageUseCase);
  const res = await getPage.execute({ type: 'home' });

  const rows = res.isOk && res.value.rows.length > 0
    ? res.value.rows
    : ZEELOVE_HOMEPAGE_ROWS;

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'زیلاو',
    url: process.env.APP_URL || 'https://zeelove.ir',
    logo: `${process.env.APP_URL || 'https://zeelove.ir'}/assets/logo.svg`,
    description: 'فروشگاه تخصصی مد و استایل زیلاو؛ پوشاک، کفش و اکسسوری اورجینال',
  };

  return (
    <StorefrontShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <main className="w-full">
        <PageRenderer rows={rows} />
      </main>
    </StorefrontShell>
  );
}
