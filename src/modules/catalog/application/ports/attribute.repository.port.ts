import type { Attribute } from '../../domain/entities/attribute.entity';

export interface AttributeRepositoryPort {
  findById(id: string): Promise<Attribute | null>;
  findByCode(code: string): Promise<Attribute | null>;
  listAll(): Promise<Attribute[]>;
  save(attribute: Attribute): Promise<void>;
  delete(id: string): Promise<void>;
}
