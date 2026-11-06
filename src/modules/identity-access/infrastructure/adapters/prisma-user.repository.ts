import type { PrismaClient } from '@prisma/client';
import type { UserRepositoryPort } from '../../application/ports/user.repository.port';
import { User } from '../../domain/user.entity';
import { MobileNumber } from '../../domain/mobile-number.vo';
import type { Role } from '../../domain/roles-permissions';

export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  public async findByMobile(mobile: MobileNumber): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { mobile: mobile.value },
    });
    if (!record) return null;
    return this.toDomain(record);
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
