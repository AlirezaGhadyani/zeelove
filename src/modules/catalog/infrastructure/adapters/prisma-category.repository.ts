import type { PrismaClient } from '@prisma/client';
import type { CategoryRepositoryPort } from '../../application/ports/category.repository.port';
import { Category } from '../../domain/entities/category.entity';
import { Slug } from '../../domain/value-objects/slug.vo';

export class PrismaCategoryRepository implements CategoryRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async findById(id: string): Promise<Category | null> {
    const record = await this.prisma.category.findUnique({
      where: { id },
    });
    return record ? this.toDomain(record) : null;
  }

  public async findBySlug(slug: string): Promise<Category | null> {
    const record = await this.prisma.category.findUnique({
      where: { slug },
    });
    return record ? this.toDomain(record) : null;
  }

  public async listAll(onlyActive = false): Promise<Category[]> {
    const records = await this.prisma.category.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: [{ parentId: 'asc' }, { displayOrder: 'asc' }, { name: 'asc' }],
    });
    return records.map((r) => this.toDomain(r));
  }

  public async save(category: Category): Promise<void> {
    const data = {
      name: category.name,
      slug: category.slug.value,
      description: category.description,
      parentId: category.parentId,
      displayOrder: category.displayOrder,
      image: category.image,
      isActive: category.isActive,
    };

    await this.prisma.category.upsert({
      where: { id: category.id },
      create: {
        id: category.id,
        ...data,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      update: {
        ...data,
        updatedAt: category.updatedAt,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }

  public async updateDisplayOrders(
    orders: Array<{ id: string; displayOrder: number; parentId?: string | null }>,
  ): Promise<void> {
    await this.prisma.$transaction(
      orders.map((o) =>
        this.prisma.category.update({
          where: { id: o.id },
          data: {
            displayOrder: o.displayOrder,
            ...(o.parentId !== undefined ? { parentId: o.parentId } : {}),
          },
        }),
      ),
    );
  }

  private toDomain(record: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    displayOrder: number;
    image: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Category {
    const slugRes = Slug.create(record.slug);
    const slug = slugRes.isOk
      ? slugRes.value
      : (Slug.create(record.name).unwrapOr(null as unknown as Slug));

    return new Category({
      id: record.id,
      name: record.name,
      slug,
      description: record.description ?? undefined,
      parentId: record.parentId,
      displayOrder: record.displayOrder,
      image: record.image ?? undefined,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
