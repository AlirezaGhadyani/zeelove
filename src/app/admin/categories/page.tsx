import React from 'react';
import { redirect } from 'next/navigation';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import {
  IDENTITY_TOKENS,
  getSessionToken,
  requirePermission,
  PERMISSIONS,
} from '@/modules/identity-access';
import { CATALOG_TOKENS } from '@/modules/catalog/infrastructure/container/register-catalog';
import { Wordmark } from '@/shared/ui/brand/wordmark';
import { Badge } from '@/shared/ui/primitives/badge';
import { AdminLogoutButton } from '../admin-logout-button';
import { AdminNav } from '../admin-nav';
import { CategoriesClient } from './categories-client';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect('/auth/login?redirect=/admin/categories');
  }

  const container = createAppContainer();
  const getCurrentUser = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
  const result = await getCurrentUser.execute({ sessionToken: token });

  if (result.isErr || !result.value) {
    redirect('/auth/login?redirect=/admin/categories');
  }

  try {
    requirePermission(result.value, PERMISSIONS.ADMIN_ACCESS);
  } catch {
    redirect('/auth/login?error=forbidden');
  }

  const categoryRepo = container.resolve(CATALOG_TOKENS.CategoryRepository);
  const categories = await categoryRepo.listAll();

  const formattedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug.value,
    description: c.description,
    parentId: c.parentId,
    displayOrder: c.displayOrder,
    image: c.image,
    isActive: c.isActive,
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Wordmark size="sm" />
            <span className="text-muted-foreground text-sm">|</span>
            <span className="font-bold text-foreground">مدیریت دسته‌بندی‌ها</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="text-xs">
              {result.value.role}
            </Badge>
            <AdminLogoutButton />
          </div>
        </header>

        <AdminNav />

        <CategoriesClient initialCategories={formattedCategories} />
      </div>
    </div>
  );
}
