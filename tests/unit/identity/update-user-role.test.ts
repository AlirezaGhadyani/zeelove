import { describe, it, expect } from 'vitest';
import { UpdateUserRoleUseCase } from '@/modules/identity-access/application/use-cases/update-user-role.use-case';
import type { UserRepositoryPort } from '@/modules/identity-access/application/ports/user.repository.port';
import { User } from '@/modules/identity-access/domain/user.entity';
import { MobileNumber } from '@/modules/identity-access/domain/mobile-number.vo';

class FakeUserRepo implements UserRepositoryPort {
  public users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }
  async findByMobile(mobile: MobileNumber): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.mobile.value === mobile.value) return u;
    }
    return null;
  }
  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
  async create(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
  async countSuperAdmins(): Promise<number> {
    let count = 0;
    for (const u of this.users.values()) {
      if (u.role === 'SUPER_ADMIN' && u.isActive()) count++;
    }
    return count;
  }
  async list(): Promise<{ items: User[]; total: number }> {
    return { items: Array.from(this.users.values()), total: this.users.size };
  }
}

function createUser(id: string, role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'CUSTOMER', suffix = '1'): User {
  return new User({
    id,
    mobile: MobileNumber.create(`0912000000${suffix}`),
    role,
    name: `User ${id}`,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

describe('UpdateUserRoleUseCase Security Privilege Tests', () => {
  it('prevents an ADMIN from granting SUPER_ADMIN role', async () => {
    const repo = new FakeUserRepo();
    const admin = createUser('admin-1', 'ADMIN');
    const target = createUser('target-1', 'EDITOR');
    await repo.create(admin);
    await repo.create(target);

    const useCase = new UpdateUserRoleUseCase(repo);
    await expect(
      useCase.execute({
        actor: admin,
        targetUserId: target.id,
        newRole: 'SUPER_ADMIN',
      })
    ).rejects.toThrow('فقط مدیر ارشد مجاز به اعطای نقش مدیر ارشد است.');
  });

  it('prevents an actor from changing their own role', async () => {
    const repo = new FakeUserRepo();
    const superAdmin = createUser('sa-1', 'SUPER_ADMIN');
    await repo.create(superAdmin);

    const useCase = new UpdateUserRoleUseCase(repo);
    await expect(
      useCase.execute({
        actor: superAdmin,
        targetUserId: superAdmin.id,
        newRole: 'ADMIN',
      })
    ).rejects.toThrow('تغییر نقش کاربری توسط خود کاربر مجاز نیست.');
  });

  it('prevents demoting the last active SUPER_ADMIN', async () => {
    const repo = new FakeUserRepo();
    const actorSa = createUser('sa-actor', 'SUPER_ADMIN');
    const soleTargetSa = createUser('sa-target', 'SUPER_ADMIN');
    // Set up repo with only 1 super admin (sole target)
    await repo.create(actorSa);
    await repo.create(soleTargetSa);
    // Artificially simulate that soleTargetSa is the only one in DB
    repo.countSuperAdmins = async () => 1;

    const useCase = new UpdateUserRoleUseCase(repo);
    await expect(
      useCase.execute({
        actor: actorSa,
        targetUserId: soleTargetSa.id,
        newRole: 'ADMIN',
      })
    ).rejects.toThrow('امکان حذف یا تنزل رتبه آخرین مدیر ارشد سامانه وجود ندارد.');
  });

  it('allows SUPER_ADMIN to grant or change roles when policies are satisfied', async () => {
    const repo = new FakeUserRepo();
    const superAdmin = createUser('sa-1', 'SUPER_ADMIN');
    const target = createUser('target-2', 'CUSTOMER');
    await repo.create(superAdmin);
    await repo.create(target);

    const useCase = new UpdateUserRoleUseCase(repo);
    const updated = await useCase.execute({
      actor: superAdmin,
      targetUserId: target.id,
      newRole: 'EDITOR',
    });

    expect(updated.role).toBe('EDITOR');
    expect((await repo.findById(target.id))?.role).toBe('EDITOR');
  });
});
