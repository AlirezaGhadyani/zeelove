import { describe, it, expect } from 'vitest';
import { defineAdminResource } from '@/modules/admin-kit';

describe('defineAdminResource Unit Test', () => {
  it('applies default CRUD actions when not explicitly specified', () => {
    const resource = defineAdminResource({
      name: 'products',
      slug: 'products',
      title: 'مدیریت محصولات',
      columns: [{ key: 'title', header: 'عنوان' }],
      fields: [{ name: 'title', label: 'عنوان', type: 'text', required: true }],
    });

    expect(resource.name).toBe('products');
    expect(resource.actions).toEqual({
      canCreate: true,
      canEdit: true,
      canDelete: true,
    });
  });

  it('preserves custom action overrides', () => {
    const resource = defineAdminResource({
      name: 'audit-logs',
      slug: 'audit-logs',
      title: 'لاگ‌های سامانه',
      columns: [{ key: 'action', header: 'عملیات' }],
      fields: [],
      actions: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
      },
    });

    expect(resource.actions?.canCreate).toBe(false);
    expect(resource.actions?.canEdit).toBe(false);
    expect(resource.actions?.canDelete).toBe(false);
  });
});
