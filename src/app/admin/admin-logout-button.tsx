'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/primitives/button';
import { logoutAction } from '@/modules/identity-access/presentation/actions/auth-actions';

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      خروج از حساب
    </Button>
  );
}
