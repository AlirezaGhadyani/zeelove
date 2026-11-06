import type { PrismaClient } from '@prisma/client';
import type {
  UserRepositoryPort,
  ListUsersFilter,
} from '../../application/ports/user.repository.port';
import { User } from '../../domain/user.entity';
import { MobileNumber } from '../../domain/mobile-number.vo';
import type { Role } from '../../domain/roles-permissions';

export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  public async findByMobile(mobile: MobileNumber): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { mobile: mobile.value } });
    return record ? this.toDomain(record) : null;
  }

  public async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        mobile: user.mobile.value,
        role: user.role,
        name: user.name,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  public async save(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        role: user.role,
        name: user.name,
        status: user.status,
        updatedAt: user.updatedAt,
      },
    });
  }

  public async countSuperAdmins(): Promise<number> {
    return this.prisma.user.count({
      where: { role: 'SUPER_ADMIN', status: 'ACTIVE' },
    });
  }

  public async list(filter?: ListUsersFilter): Promise<{ items: User[]; total: number }> {
    const page = Math.max(1, filter?.page ?? 1);
    const limit = Math.min(100, Math.max(1, filter?.limit ?? 20));
    const skip = (page - 1) * limit;
    const where = filter?.search
      ? {
          OR: [{ mobile: { contains: filter.search } }, { name: { contains: filter.search } }],
        }
      : {};

    const [total, records] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);

    return {
      items: records.map((r) => this.toDomain(r)),
      total,
    };
  }

  private toDomain(record: {
    id: string;
    mobile: string;
    role: string;
    name: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: record.id,
      mobile: MobileNumber.create(record.mobile),
      role: record.role as Role,
      name: record.name,
      status: record.status as 'ACTIVE' | 'SUSPENDED',
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
