'use server';

import { z } from 'zod';
import { prisma } from '@/shared/infrastructure/database/prisma';
import { PrismaUserRepository } from '../../infrastructure/adapters/prisma-user.repository';
import { UpdateUserRoleUseCase } from '../../application/use-cases/update-user-role.use-case';
import { PrismaAuditService } from '@/modules/audit';
import { getSessionToken, IDENTITY_TOKENS, requirePermission, PERMISSIONS } from '@/modules/identity-access';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import type { Role } from '../../domain/roles-permissions';

const userRepo = new PrismaUserRepository(prisma);
const updateUserRoleUseCase = new UpdateUserRoleUseCase(userRepo);
const auditService = new PrismaAuditService(prisma);

const updateRoleSchema = z.object({
  targetUserId: z.string().min(1, 'شناسه کاربر نامعتبر است.'),
  newRole: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'SUPPORT', 'CUSTOMER']),
});

async function getActor() {
  const token = await getSessionToken();
  const container = createAppContainer();
  const getCurrentUser = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
  const userRes = await getCurrentUser.execute({ sessionToken: token || '' });
  if (userRes.isErr || !userRes.value) {
    throw new Error('برای دسترسی به این بخش باید وارد حساب خود شوید.');
  }
  return requirePermission(userRes.value, PERMISSIONS.USERS_MANAGE);
}

export async function listUsersAction(params?: { page?: number; limit?: number; search?: string }) {
  await getActor();
  const result = await userRepo.list(params);
  return {
    items: result.items.map((u) => ({
      id: u.id,
      mobile: u.mobile.value,
      role: u.role,
      name: u.name ?? '',
      status: u.status,
      createdAt: u.createdAt.toISOString(),
    })),
    total: result.total,
  };
}

export async function updateUserRoleAction(payload: { targetUserId: string; newRole: Role }) {
  try {
    const actor = await getActor();
    const validated = updateRoleSchema.parse(payload);
    const existing = await userRepo.findById(validated.targetUserId);

    const updated = await updateUserRoleUseCase.execute({
      actor,
      targetUserId: validated.targetUserId,
      newRole: validated.newRole,
    });

    await auditService.record({
      adminId: actor.id,
      action: 'USER_ROLE_UPDATE',
      entity: 'User',
      entityId: updated.id,
      before: { role: existing?.role },
      after: { role: updated.role },
    });

    return {
      ok: true,
      user: {
        id: updated.id,
        role: updated.role,
        mobile: updated.mobile.value,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'خطا در ویرایش نقش کاربر';
    return { ok: false, error: message };
  }
}
