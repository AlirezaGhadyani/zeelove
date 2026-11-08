import { NextResponse } from 'next/server';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog/infrastructure/container/register-catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  const container = createAppContainer();
  const manageCategories = container.resolve(CATALOG_TOKENS.ManageCategoriesUseCase);
  const categories = await manageCategories.listAll(true);

  const items = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug.value,
    description: c.description,
    parentId: c.parentId,
    displayOrder: c.displayOrder,
    image: c.image,
    isActive: c.isActive,
  }));

  return NextResponse.json({ categories: items });
}
