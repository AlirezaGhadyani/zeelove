import { NextResponse } from 'next/server';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog/infrastructure/container/register-catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  const container = createAppContainer();
  const manageBrands = container.resolve(CATALOG_TOKENS.ManageBrandsUseCase);
  const brands = await manageBrands.listAll(true);

  const items = brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug.value,
    logo: b.logo,
    description: b.description,
    websiteUrl: b.websiteUrl,
    isActive: b.isActive,
  }));

  return NextResponse.json({ brands: items });
}
