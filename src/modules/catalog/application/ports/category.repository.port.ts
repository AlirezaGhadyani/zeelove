import type { Category } from '../../domain/entities/category.entity';

export interface CategoryRepositoryPort {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  listAll(onlyActive?: boolean): Promise<Category[]>;
  save(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
  updateDisplayOrders(orders: Array<{ id: string; displayOrder: number; parentId?: string | null }>): Promise<void>;
}
