import { Result, ok, err } from '@/shared/kernel/result';
import { NotFoundError, ConflictError, ValidationError, type DomainError } from '@/shared/kernel/domain-error';
import type { CategoryRepositoryPort } from '../ports/category.repository.port';
import { Category } from '../../domain/entities/category.entity';
import { Slug } from '../../domain/value-objects/slug.vo';

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  displayOrder?: number;
  image?: string;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  displayOrder?: number;
  image?: string;
  isActive?: boolean;
}

export class ManageCategoriesUseCase {
  constructor(private readonly categoryRepo: CategoryRepositoryPort) {}

  public async listAll(onlyActive = false): Promise<Category[]> {
    return this.categoryRepo.listAll(onlyActive);
  }

  public async create(input: CreateCategoryInput): Promise<Result<Category, DomainError>> {
    if (!input.name || input.name.trim().length === 0) {
      return err(new ValidationError('Category name is required'));
    }

    const slugRes = Slug.create(input.slug || input.name);
    if (slugRes.isErr) return err(slugRes.error);

    const existing = await this.categoryRepo.findBySlug(slugRes.value.value);
    if (existing) {
      return err(new ConflictError(`Category with slug "${slugRes.value.value}" already exists`));
    }

    const category = new Category({
      id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name.trim(),
      slug: slugRes.value,
      description: input.description,
      parentId: input.parentId || null,
      displayOrder: input.displayOrder ?? 0,
      image: input.image,
      isActive: input.isActive ?? true,
    });

    await this.categoryRepo.save(category);
    return ok(category);
  }

  public async update(input: UpdateCategoryInput): Promise<Result<Category, DomainError>> {
    const category = await this.categoryRepo.findById(input.id);
    if (!category) return err(new NotFoundError('Category', input.id));

    let slug = category.slug;
    if (input.slug && input.slug !== category.slug.value) {
      const slugRes = Slug.create(input.slug);
      if (slugRes.isErr) return err(slugRes.error);
      const existing = await this.categoryRepo.findBySlug(slugRes.value.value);
      if (existing && existing.id !== category.id) {
        return err(new ConflictError(`Category with slug "${slugRes.value.value}" already exists`));
      }
      slug = slugRes.value;
    }

    category.update({
      name: input.name,
      slug,
      description: input.description,
      parentId: input.parentId,
      displayOrder: input.displayOrder,
      image: input.image,
      isActive: input.isActive,
    });

    await this.categoryRepo.save(category);
    return ok(category);
  }

  public async delete(id: string): Promise<Result<boolean, DomainError>> {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) return err(new NotFoundError('Category', id));
    await this.categoryRepo.delete(id);
    return ok(true);
  }

  public async reorderTree(orders: Array<{ id: string; displayOrder: number; parentId?: string | null }>): Promise<void> {
    await this.categoryRepo.updateDisplayOrders(orders);
  }
}
