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
import { NavigationClient, type AdminMenuData } from './navigation-client';

export const dynamic = 'force-dynamic';

export default async function AdminNavigationPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect('/auth/login?redirect=/admin/navigation');
  }

  const container = createAppContainer();
  const getCurrentUser = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
  const result = await getCurrentUser.execute({ sessionToken: token });

  if (result.isErr || !result.value) {
    redirect('/auth/login?redirect=/admin/navigation');
  }

  try {
    requirePermission(result.value, PERMISSIONS.ADMIN_ACCESS);
  } catch {
    redirect('/auth/login?error=forbidden');
  }

  const prisma = container.resolve(TOKENS.Prisma);

  const menusData = await prisma.navigationMenu.findMany({
    include: {
      items: {
        orderBy: { displayOrder: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  const formattedMenus: AdminMenuData[] = menusData.map((m) => ({
    id: m.id,
    code: m.code,
    title: m.title,
    items: m.items.map((i) => ({
      id: i.id,
      menuId: i.menuId,
      parentId: i.parentId,
      title: i.title,
      url: i.url,
      target: i.target ?? '_self',
      displayOrder: i.displayOrder,
      isActive: i.isActive,
    })),
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Wordmark size="sm" />
            <span className="text-muted-foreground text-sm">|</span>
            <span className="font-bold text-foreground">مدیریت منوهای ناوبری</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="text-xs">
              {result.value.role}
            </Badge>
            <AdminLogoutButton />
          </div>
        </header>

        <AdminNav />

        <NavigationClient initialMenus={formattedMenus} />
      </div>
    </div>
  );
}
