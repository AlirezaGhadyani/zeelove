import type {
  MediaRepositoryPort,
  ListMediaFilter,
  ListMediaResult,
} from '../ports/media.repository.port';

export type ListMediaInput = ListMediaFilter;

export class ListMediaUseCase {
  constructor(private readonly mediaRepo: MediaRepositoryPort) {}

  public async execute(input: ListMediaInput): Promise<ListMediaResult> {
    return this.mediaRepo.findMany(input);
  }
}
