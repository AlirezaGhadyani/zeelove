'use client';

import React from 'react';
import { Button } from '@/shared/ui/primitives/button';
import { logoutAction } from '@/modules/identity-access/presentation/actions/auth-actions';

export function AdminLogoutButton() {
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutAction();
    } catch (err) {
      console.warn('[AI Studio] Admin logout warning:', err);
    } finally {
      window.location.href = '/auth/login';
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      data-testid="admin-logout-button"
    >
      خروج از حساب
    </Button>
  );
}
