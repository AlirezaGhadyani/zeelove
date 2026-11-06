export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'SUPPORT' | 'CUSTOMER';

export const ROLES: Record<Role, Role> = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  SUPPORT: 'SUPPORT',
  CUSTOMER: 'CUSTOMER',
};

export const PERMISSIONS = {
  ADMIN_ACCESS: 'admin.access',
  CATALOG_READ: 'catalog.read',
  CATALOG_MANAGE: 'catalog.manage',
  ORDERS_READ: 'orders.read',
  ORDERS_MANAGE: 'orders.manage',
  USERS_MANAGE: 'users.manage',
  SETTINGS_MANAGE: 'settings.manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS] | string;

export const ROLE_PERMISSIONS: Record<Role, ReadonlyArray<string>> = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.CATALOG_READ,
    PERMISSIONS.CATALOG_MANAGE,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  EDITOR: [PERMISSIONS.ADMIN_ACCESS, PERMISSIONS.CATALOG_READ, PERMISSIONS.CATALOG_MANAGE],
  SUPPORT: [PERMISSIONS.ADMIN_ACCESS, PERMISSIONS.CATALOG_READ, PERMISSIONS.ORDERS_READ],
  CUSTOMER: [PERMISSIONS.CATALOG_READ],
};

export function hasPermission(role: Role, permission: string): boolean {
  if (role === 'SUPER_ADMIN') {
    return true;
  }
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) {
    return false;
  }
  return perms.includes('*') || perms.includes(permission);
}
