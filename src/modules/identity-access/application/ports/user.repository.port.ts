import type { User } from '../../domain/user.entity';
import type { MobileNumber } from '../../domain/mobile-number.vo';

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByMobile(mobile: MobileNumber): Promise<User | null>;
  save(user: User): Promise<void>;
  create(user: User): Promise<void>;
}
