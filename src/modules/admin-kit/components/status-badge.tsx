import React from 'react';
import { Badge } from '@/shared/ui/primitives/badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const config: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    ACTIVE: { label: 'فعال', variant: 'default' },
    PUBLISHED: { label: 'منتشر شده', variant: 'default' },
    SUCCESS: { label: 'موفق', variant: 'default' },
    INACTIVE: { label: 'غیرفعال', variant: 'secondary' },
    DRAFT: { label: 'پیش‌نویس', variant: 'secondary' },
    SUSPENDED: { label: 'معلق', variant: 'destructive' },
    FAILED: { label: 'ناموفق', variant: 'destructive' },
    BLOCKED: { label: 'مسدود', variant: 'destructive' },
    PENDING: { label: 'در انتظار', variant: 'outline' },
  };

  const item = config[normalized] || { label: status, variant: 'outline' };

  return (
    <Badge variant={item.variant} className={className}>
      {item.label}
    </Badge>
  );
}
