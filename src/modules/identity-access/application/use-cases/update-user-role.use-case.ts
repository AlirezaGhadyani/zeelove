import type { UserRepositoryPort } from '../ports/user.repository.port';
import type { User } from '../../domain/user.entity';
import { type Role, PERMISSIONS } from '../../domain/roles-permissions';
import { DomainRuleViolationError, ForbiddenError, NotFoundError } from '@/shared/kernel/domain-error';
import { requirePermission } from '../guards/require-permission';

export interface UpdateUserRoleInput {
  actor: User;
  targetUserId: string;
  newRole: Role;
}

export class UpdateUserRoleUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  public async execute(input: UpdateUserRoleInput): Promise<User> {
    const { actor, targetUserId, newRole } = input;

    // 1. Actor must have user management permission
    requirePermission(actor, PERMISSIONS.USERS_MANAGE);

    // 2. Prevent self-demotion or self-elevation
    if (actor.id === targetUserId) {
      throw new DomainRuleViolationError(
        'SELF_ROLE_CHANGE',
        'تغییر نقش کاربری توسط خود کاربر مجاز نیست.'
      );
    }

    // 3. Only SUPER_ADMIN can grant the SUPER_ADMIN role
    if (newRole === 'SUPER_ADMIN' && actor.role !== 'SUPER_ADMIN') {
      throw new ForbiddenError('فقط مدیر ارشد مجاز به اعطای نقش مدیر ارشد است.');
    }

    // 4. Find target user
    const targetUser = await this.userRepo.findById(targetUserId);
    if (!targetUser) {
      throw new NotFoundError('User', targetUserId);
    }

    // 5. If target user is SUPER_ADMIN and actor is not SUPER_ADMIN, prevent modification
    if (targetUser.role === 'SUPER_ADMIN' && actor.role !== 'SUPER_ADMIN') {
      throw new ForbiddenError('شما دسترسی لازم برای تغییر نقش مدیر ارشد را ندارید.');
    }

    // 6. Prevent demoting the last SUPER_ADMIN
    if (targetUser.role === 'SUPER_ADMIN' && newRole !== 'SUPER_ADMIN') {
      const superAdminCount = await this.userRepo.countSuperAdmins();
      if (superAdminCount <= 1) {
        throw new DomainRuleViolationError(
          'LAST_SUPER_ADMIN',
          'امکان حذف یا تنزل رتبه آخرین مدیر ارشد سامانه وجود ندارد.'
        );
      }
    }

    // 7. Update and save
    targetUser.updateRole(newRole);
    await this.userRepo.save(targetUser);

    return targetUser;
  }
}
