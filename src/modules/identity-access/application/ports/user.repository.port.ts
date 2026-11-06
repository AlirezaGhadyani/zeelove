import type { User } from '../../domain/user.entity';
import type { MobileNumber } from '../../domain/mobile-number.vo';

export interface ListUsersFilter {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByMobile(mobile: MobileNumber): Promise<User | null>;
  save(user: User): Promise<void>;
  create(user: User): Promise<void>;
  countSuperAdmins(): Promise<number>;
  list(filter?: ListUsersFilter): Promise<{ items: User[]; total: number }>;
}
