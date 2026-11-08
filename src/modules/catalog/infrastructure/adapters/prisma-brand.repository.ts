import type { PrismaClient } from '@prisma/client';
import type { BrandRepositoryPort } from '../../application/ports/brand.repository.port';
import { Brand } from '../../domain/entities/brand.entity';
import { Slug } from '../../domain/value-objects/slug.vo';

export class PrismaBrandRepository implements BrandRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async findById(id: string): Promise<Brand | null> {
    const record = await this.prisma.brand.findUnique({
      where: { id },
    });
    return record ? this.toDomain(record) : null;
  }

  public async findBySlug(slug: string): Promise<Brand | null> {
    const record = await this.prisma.brand.findUnique({
      where: { slug },
    });
    return record ? this.toDomain(record) : null;
  }

  public async listAll(onlyActive = false): Promise<Brand[]> {
    const records = await this.prisma.brand.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { name: 'asc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  public async save(brand: Brand): Promise<void> {
    const data = {
      name: brand.name,
      slug: brand.slug.value,
      logo: brand.logo,
      description: brand.description,
      websiteUrl: brand.websiteUrl,
      isActive: brand.isActive,
    };

    await this.prisma.brand.upsert({
      where: { id: brand.id },
      create: {
        id: brand.id,
        ...data,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
      },
      update: {
        ...data,
        updatedAt: brand.updatedAt,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.brand.delete({
      where: { id },
    });
  }

  private toDomain(record: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
    websiteUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Brand {
    const slugRes = Slug.create(record.slug);
    const slug = slugRes.isOk
      ? slugRes.value
      : (Slug.create(record.name).unwrapOr(null as unknown as Slug));

    return new Brand({
      id: record.id,
      name: record.name,
      slug,
      logo: record.logo ?? undefined,
      description: record.description ?? undefined,
      websiteUrl: record.websiteUrl ?? undefined,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
