import React from 'react';
import { redirect } from 'next/navigation';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import {
  IDENTITY_TOKENS,
  getSessionToken,
  requirePermission,
  PERMISSIONS,
} from '@/modules/identity-access';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { Badge } from '@/shared/ui/primitives/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/shared/ui/primitives/card';
import { Wordmark } from '@/shared/ui/brand/wordmark';
import { t } from '@/i18n';
import { AdminLogoutButton } from './admin-logout-button';
import { UsersTable } from './users-table';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect('/auth/login?redirect=/admin');
  }

  const container = createAppContainer();
  const getCurrentUser = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
  const result = await getCurrentUser.execute({ sessionToken: token });

  if (result.isErr || !result.value) {
    redirect('/auth/login?redirect=/admin');
  }

  const user = result.value;

  try {
    requirePermission(user, PERMISSIONS.ADMIN_ACCESS);
  } catch {
    redirect('/auth/login?error=forbidden');
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Wordmark size="sm" />
            <span className="text-muted-foreground text-sm">|</span>
            <span className="font-bold text-foreground">{t('admin.panelTitle')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="text-xs">
              {user.role}
            </Badge>
            <AdminLogoutButton />
          </div>
        </header>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>{t('admin.welcome', { name: user.name || 'مدیر گرامی' })}</CardTitle>
            <CardDescription>
              {t('admin.mobileLabel')}{' '}
              <span className="font-mono">{toPersianDigits(user.mobile.value)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
              {t('admin.authSuccessMessage', { role: user.role })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6">
            <UsersTable currentUserId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
