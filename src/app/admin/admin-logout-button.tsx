'use client';

import React from 'react';
import { Button } from '@/shared/ui/primitives/button';
import { logoutAction } from '@/modules/identity-access/presentation/actions/auth-actions';

export function AdminLogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        data-testid="admin-logout-button"
      >
        خروج از حساب
      </Button>
    </form>
  );
}
