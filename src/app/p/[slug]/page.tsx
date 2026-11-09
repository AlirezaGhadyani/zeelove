import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { appContainer } from '@/shared/infrastructure/container/app-container';
import { CONTENT_TOKENS } from '@/modules/content/infrastructure/container/register-content';
import { StorefrontShell } from '@/components/storefront/storefront-shell';
import { PageRenderer } from '@/modules/content/rendering/page-renderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const getPage = appContainer.resolve(CONTENT_TOKENS.GetPageUseCase);
  const res = await getPage.execute({ slug });

  if (!res.isOk) {
    return { title: 'برگه یافت نشد | زیلاو' };
  }

  const page = res.value.page;
  return {
    title: page.seo?.metaTitle || `${page.title} | زیلاو`,
    description: page.seo?.metaDescription || page.title,
    alternates: page.seo?.canonicalUrl
      ? { canonical: page.seo.canonicalUrl }
      : undefined,
  };
}

export default async function CustomCmsPage({ params }: PageProps) {
  const { slug } = await params;
  const getPage = appContainer.resolve(CONTENT_TOKENS.GetPageUseCase);
  const res = await getPage.execute({ slug });

  if (!res.isOk || !res.value.version) {
    notFound();
  }

  return (
    <StorefrontShell>
      <main className="w-full py-8">
        <PageRenderer rows={res.value.rows} />
      </main>
    </StorefrontShell>
  );
}
