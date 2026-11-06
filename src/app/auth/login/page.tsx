import React, { Suspense } from 'react';
import { LoginCard } from '@/modules/identity-access/presentation/components/login-card';
import { t } from '@/i18n';

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Suspense
        fallback={
          <div className="text-center p-8 text-muted-foreground">{t('common.loading')}</div>
        }
      >
        <LoginCard />
      </Suspense>
    </main>
  );
}
