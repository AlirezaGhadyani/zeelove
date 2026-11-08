import { Result, ok, err } from '@/shared/kernel/result';
import { NotFoundError, ConflictError, ValidationError, type DomainError } from '@/shared/kernel/domain-error';
import type { BrandRepositoryPort } from '../ports/brand.repository.port';
import { Brand } from '../../domain/entities/brand.entity';
import { Slug } from '../../domain/value-objects/slug.vo';

export interface CreateBrandInput {
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  websiteUrl?: string;
  isActive?: boolean;
}

export interface UpdateBrandInput {
  id: string;
  name?: string;
  slug?: string;
  logo?: string;
  description?: string;
  websiteUrl?: string;
  isActive?: boolean;
}

export class ManageBrandsUseCase {
  constructor(private readonly brandRepo: BrandRepositoryPort) {}

  public async listAll(onlyActive = false): Promise<Brand[]> {
    return this.brandRepo.listAll(onlyActive);
  }

  public async create(input: CreateBrandInput): Promise<Result<Brand, DomainError>> {
    if (!input.name || input.name.trim().length === 0) {
      return err(new ValidationError('Brand name is required'));
    }

    const slugRes = Slug.create(input.slug || input.name);
    if (slugRes.isErr) return err(slugRes.error);

    const existing = await this.brandRepo.findBySlug(slugRes.value.value);
    if (existing) {
      return err(new ConflictError(`Brand with slug "${slugRes.value.value}" already exists`));
    }

    const brand = new Brand({
      id: `brand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name.trim(),
      slug: slugRes.value,
      logo: input.logo,
      description: input.description,
      websiteUrl: input.websiteUrl,
      isActive: input.isActive ?? true,
    });

    await this.brandRepo.save(brand);
    return ok(brand);
  }

  public async update(input: UpdateBrandInput): Promise<Result<Brand, DomainError>> {
    const brand = await this.brandRepo.findById(input.id);
    if (!brand) return err(new NotFoundError('Brand', input.id));

    let slug = brand.slug;
    if (input.slug && input.slug !== brand.slug.value) {
      const slugRes = Slug.create(input.slug);
      if (slugRes.isErr) return err(slugRes.error);
      const existing = await this.brandRepo.findBySlug(slugRes.value.value);
      if (existing && existing.id !== brand.id) {
        return err(new ConflictError(`Brand with slug "${slugRes.value.value}" already exists`));
      }
      slug = slugRes.value;
    }

    brand.update({
      name: input.name,
      slug,
      logo: input.logo,
      description: input.description,
      websiteUrl: input.websiteUrl,
      isActive: input.isActive,
    });

    await this.brandRepo.save(brand);
    return ok(brand);
  }

  public async delete(id: string): Promise<Result<boolean, DomainError>> {
    const existing = await this.brandRepo.findById(id);
    if (!existing) return err(new NotFoundError('Brand', id));
    await this.brandRepo.delete(id);
    return ok(true);
  }
}
