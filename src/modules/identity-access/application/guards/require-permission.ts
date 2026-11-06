import { UnauthorizedError, ForbiddenError } from '@/shared/kernel/domain-error';
import type { User } from '../../domain/user.entity';

export function requireUser(user: User | null | undefined): User {
  if (!user) {
    throw new UnauthorizedError('برای دسترسی به این بخش باید وارد حساب کاربری خود شوید.');
  }
  if (!user.isActive()) {
    throw new ForbiddenError('حساب کاربری شما غیرفعال شده است.');
  }
  return user;
}

export function requirePermission(user: User | null | undefined, permission: string): User {
  const activeUser = requireUser(user);
  if (!activeUser.hasPermission(permission)) {
    throw new ForbiddenError('شما مجوز لازم برای انجام این عملیات را ندارید.');
  }
  return activeUser;
}
