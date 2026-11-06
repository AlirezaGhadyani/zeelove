import type { Media } from '../../domain/media.entity';

export interface ListMediaFilter {
  folder?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface ListMediaResult {
  items: Media[];
  total: number;
  folders: string[];
}

export interface MediaRepositoryPort {
  findById(id: string): Promise<Media | null>;
  create(media: Media): Promise<void>;
  delete(id: string): Promise<void>;
  findMany(filter: ListMediaFilter): Promise<ListMediaResult>;
}
