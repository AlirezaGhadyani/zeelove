import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok } from '@/shared/kernel/result';
import type { NavigationRepositoryPort } from '../ports/navigation.repository.port';
import type { MenuItem } from '../../domain/entities/menu-item.entity';

export interface GetMenuInput {
  code: string;
}

export interface GetMenuOutput {
  code: string;
  title: string;
  items: MenuItem[];
}

export class GetMenuUseCase implements UseCase<GetMenuInput, Result<GetMenuOutput | null, never>> {
  constructor(private readonly repo: NavigationRepositoryPort) {}

  public async execute(input: GetMenuInput): Promise<Result<GetMenuOutput | null, never>> {
    const menu = await this.repo.findByCode(input.code);
    if (!menu) {
      return ok(null);
    }

    return ok({
      code: menu.code,
      title: menu.title,
      items: menu.getTree(),
    });
  }
}
