import type { PrismaClient } from '@prisma/client';
import type { AttributeRepositoryPort } from '../../application/ports/attribute.repository.port';
import { Attribute, type AttributeType } from '../../domain/entities/attribute.entity';

export class PrismaAttributeRepository implements AttributeRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async findById(id: string): Promise<Attribute | null> {
    const record = await this.prisma.attribute.findUnique({
      where: { id },
    });
    return record ? this.toDomain(record) : null;
  }

  public async findByCode(code: string): Promise<Attribute | null> {
    const record = await this.prisma.attribute.findUnique({
      where: { code },
    });
    return record ? this.toDomain(record) : null;
  }

  public async listAll(): Promise<Attribute[]> {
    const records = await this.prisma.attribute.findMany({
      orderBy: { name: 'asc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  public async save(attribute: Attribute): Promise<void> {
    const data = {
      name: attribute.name,
      code: attribute.code,
      type: attribute.type,
      options: attribute.options ? (attribute.options as unknown as object) : undefined,
    };

    await this.prisma.attribute.upsert({
      where: { id: attribute.id },
      create: {
        id: attribute.id,
        ...data,
        createdAt: attribute.createdAt,
      },
      update: {
        ...data,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.attribute.delete({
      where: { id },
    });
  }

  private toDomain(record: {
    id: string;
    name: string;
    code: string;
    type: string;
    options: unknown;
    createdAt: Date;
  }): Attribute {
    const options = Array.isArray(record.options) ? (record.options as string[]) : undefined;

    return new Attribute({
      id: record.id,
      name: record.name,
      code: record.code,
      type: (record.type as AttributeType) || 'TEXT',
      options,
      createdAt: record.createdAt,
    });
  }
}
