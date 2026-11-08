import type { Brand } from '../../domain/entities/brand.entity';

export interface BrandRepositoryPort {
  findById(id: string): Promise<Brand | null>;
  findBySlug(slug: string): Promise<Brand | null>;
  listAll(onlyActive?: boolean): Promise<Brand[]>;
  save(brand: Brand): Promise<void>;
  delete(id: string): Promise<void>;
}
