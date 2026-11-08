import React from 'react';
import { redirect } from 'next/navigation';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import {
  IDENTITY_TOKENS,
  getSessionToken,
  requirePermission,
  PERMISSIONS,
} from '@/modules/identity-access';
import { TOKENS } from '@/shared/infrastructure/container/tokens';
import { Wordmark } from '@/shared/ui/brand/wordmark';
import { Badge } from '@/shared/ui/primitives/badge';
import { AdminLogoutButton } from '../admin-logout-button';
import { AdminNav } from '../admin-nav';
import { InventoryClient, type AdminInventoryItem } from './inventory-client';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect('/auth/login?redirect=/admin/inventory');
  }

  const container = createAppContainer();
  const getCurrentUser = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
  const result = await getCurrentUser.execute({ sessionToken: token });

  if (result.isErr || !result.value) {
    redirect('/auth/login?redirect=/admin/inventory');
  }

  try {
    requirePermission(result.value, PERMISSIONS.ADMIN_ACCESS);
  } catch {
    redirect('/auth/login?error=forbidden');
  }

  const prisma = container.resolve(TOKENS.Prisma);

  const variants = await prisma.productVariant.findMany({
    include: {
      product: { select: { title: true } },
      inventory: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 150,
  });

  const formattedItems: AdminInventoryItem[] = variants.map((v) => ({
    variantId: v.id,
    sku: v.sku,
    productTitle: v.product.title,
    priceToman: v.price,
    stock: v.inventory?.quantity ?? 0,
    safetyStock: v.inventory?.safetyStock ?? 0,
    options: (typeof v.options === 'object' && v.options !== null ? v.options : {}) as Record<string, string>,
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Wordmark size="sm" />
            <span className="text-muted-foreground text-sm">|</span>
            <span className="font-bold text-foreground">مدیریت موجودی انبار</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="text-xs">
              {result.value.role}
            </Badge>
            <AdminLogoutButton />
          </div>
        </header>

        <AdminNav />

        <InventoryClient initialItems={formattedItems} />
      </div>
    </div>
  );
}
