import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok, err } from '@/shared/kernel/result';
import type { PageRepositoryPort } from '../ports/page.repository.port';
import type { Page } from '../../domain/entities/page.entity';
import type { PageVersion } from '../../domain/entities/page-version.entity';
import type { PageType, RowLayout } from '../../domain/types/page-builder.types';

export interface GetPageInput {
  slug?: string;
  type?: PageType;
}

export interface GetPageOutput {
  page: Page;
  version: PageVersion | null;
  rows: RowLayout[];
}

export class GetPageUseCase
  implements UseCase<GetPageInput, Result<GetPageOutput, string>>
{
  constructor(private readonly pageRepo: PageRepositoryPort) {}

  public async execute(
    input: GetPageInput,
  ): Promise<Result<GetPageOutput, string>> {
    let page: Page | null = null;

    if (input.slug) {
      page = await this.pageRepo.findBySlug(input.slug);
    } else if (input.type) {
      page = await this.pageRepo.findByType(input.type);
    } else {
      page = await this.pageRepo.findByType('home');
    }

    if (!page) {
      return err('برگه مورد نظر یافت نشد');
    }

    const version = await this.pageRepo.findActiveVersion(page.id);
    const rows = version ? version.rows : [];

    return ok({
      page,
      version,
      rows,
    });
  }
}
