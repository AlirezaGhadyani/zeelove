import { Result, ok, err } from '@/shared/kernel/result';
import { NotFoundError, ConflictError, ValidationError, type DomainError } from '@/shared/kernel/domain-error';
import type { AttributeRepositoryPort } from '../ports/attribute.repository.port';
import { Attribute, type AttributeType } from '../../domain/entities/attribute.entity';

export interface CreateAttributeInput {
  name: string;
  code: string;
  type?: AttributeType;
  options?: string[];
}

export interface UpdateAttributeInput {
  id: string;
  name?: string;
  code?: string;
  type?: AttributeType;
  options?: string[];
}

export class ManageAttributesUseCase {
  constructor(private readonly attributeRepo: AttributeRepositoryPort) {}

  public async listAll(): Promise<Attribute[]> {
    return this.attributeRepo.listAll();
  }

  public async create(input: CreateAttributeInput): Promise<Result<Attribute, DomainError>> {
    if (!input.name || input.name.trim().length === 0) {
      return err(new ValidationError('Attribute name is required'));
    }
    const cleanCode = input.code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    if (!cleanCode) {
      return err(new ValidationError('Attribute code is required'));
    }

    const existing = await this.attributeRepo.findByCode(cleanCode);
    if (existing) {
      return err(new ConflictError(`Attribute code "${cleanCode}" already exists`));
    }

    const attribute = new Attribute({
      id: `attr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name.trim(),
      code: cleanCode,
      type: input.type ?? 'TEXT',
      options: input.options,
    });

    await this.attributeRepo.save(attribute);
    return ok(attribute);
  }

  public async update(input: UpdateAttributeInput): Promise<Result<Attribute, DomainError>> {
    const attribute = await this.attributeRepo.findById(input.id);
    if (!attribute) return err(new NotFoundError('Attribute', input.id));

    if (input.code && input.code !== attribute.code) {
      const cleanCode = input.code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      const existing = await this.attributeRepo.findByCode(cleanCode);
      if (existing && existing.id !== attribute.id) {
        return err(new ConflictError(`Attribute code "${cleanCode}" already exists`));
      }
      attribute.update({ code: cleanCode });
    }

    attribute.update({
      name: input.name,
      type: input.type,
      options: input.options,
    });

    await this.attributeRepo.save(attribute);
    return ok(attribute);
  }

  public async delete(id: string): Promise<Result<boolean, DomainError>> {
    const existing = await this.attributeRepo.findById(id);
    if (!existing) return err(new NotFoundError('Attribute', id));
    await this.attributeRepo.delete(id);
    return ok(true);
  }
}
