import { describe, it, expect } from 'vitest';
import { hasPermission, PERMISSIONS } from '@/modules/identity-access/domain/roles-permissions';
import { User } from '@/modules/identity-access/domain/user.entity';
import { MobileNumber } from '@/modules/identity-access/domain/mobile-number.vo';
import {
  requirePermission,
  requireUser,
} from '@/modules/identity-access/application/guards/require-permission';
import { UnauthorizedError, ForbiddenError } from '@/shared/kernel/domain-error';

describe('Roles & Permissions (RBAC)', () => {
  it('SUPER_ADMIN has bypass for all permissions', () => {
    expect(hasPermission('SUPER_ADMIN', PERMISSIONS.ADMIN_ACCESS)).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'arbitrary.permission.xyz')).toBe(true);
  });

  it('ADMIN and EDITOR have structured permissions', () => {
    expect(hasPermission('ADMIN', PERMISSIONS.ADMIN_ACCESS)).toBe(true);
    expect(hasPermission('ADMIN', PERMISSIONS.USERS_MANAGE)).toBe(true);

    expect(hasPermission('EDITOR', PERMISSIONS.ADMIN_ACCESS)).toBe(true);
    expect(hasPermission('EDITOR', PERMISSIONS.CATALOG_MANAGE)).toBe(true);
    expect(hasPermission('EDITOR', PERMISSIONS.USERS_MANAGE)).toBe(false);
  });

  it('CUSTOMER cannot access admin areas', () => {
    expect(hasPermission('CUSTOMER', PERMISSIONS.ADMIN_ACCESS)).toBe(false);
    expect(hasPermission('CUSTOMER', PERMISSIONS.CATALOG_READ)).toBe(true);
  });

  it('requirePermission guard enforces permission rules', () => {
    expect(() => requireUser(null)).toThrow(UnauthorizedError);

    const customer = new User({
      id: 'cust-1',
      mobile: MobileNumber.create('09121111111'),
      role: 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(() => requirePermission(customer, PERMISSIONS.ADMIN_ACCESS)).toThrow(ForbiddenError);

    const superAdmin = new User({
      id: 'admin-1',
      mobile: MobileNumber.create('09120000000'),
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(() => requirePermission(superAdmin, PERMISSIONS.ADMIN_ACCESS)).not.toThrow();
  });
});
