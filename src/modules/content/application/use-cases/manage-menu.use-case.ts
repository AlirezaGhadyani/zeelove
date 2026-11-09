import { Result, ok, err } from '@/shared/kernel/result';
import { DomainRuleViolationError } from '@/shared/kernel/domain-error';
import type { NavigationRepositoryPort } from '../ports/navigation.repository.port';
import { MenuItem } from '../../domain/entities/menu-item.entity';

export interface CreateMenuItemInput {
  menuId: string;
  parentId?: string | null;
  title: string;
  url: string;
  target?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateMenuItemInput {
  id: string;
  parentId?: string | null;
  title: string;
  url: string;
  target?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export class ManageMenuUseCase {
  constructor(private readonly repo: NavigationRepositoryPort) {}

  public async createItem(input: CreateMenuItemInput): Promise<Result<MenuItem, DomainRuleViolationError>> {
    if (!input.title.trim()) {
      return err(new DomainRuleViolationError('INVALID_TITLE', 'عنوان منو الزامی است'));
    }
    if (!input.url.trim()) {
      return err(new DomainRuleViolationError('INVALID_URL', 'آدرس لینک منو الزامی است'));
    }

    const item = new MenuItem({
      id: `menu-item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      menuId: input.menuId,
      parentId: input.parentId ?? null,
      title: input.title,
      url: input.url,
      target: input.target || '_self',
      displayOrder: input.displayOrder ?? 0,
      isActive: input.isActive ?? true,
    });

    await this.repo.saveMenuItem(item);
    return ok(item);
  }

  public async updateItem(input: UpdateMenuItemInput): Promise<Result<void, DomainRuleViolationError>> {
    const item = new MenuItem({
      id: input.id,
      menuId: '', // preserved in repo
      parentId: input.parentId,
      title: input.title,
      url: input.url,
      target: input.target || '_self',
      displayOrder: input.displayOrder ?? 0,
      isActive: input.isActive ?? true,
    });

    await this.repo.saveMenuItem(item);
    return ok(undefined);
  }

  public async deleteItem(id: string): Promise<Result<void, never>> {
    await this.repo.deleteMenuItem(id);
    return ok(undefined);
  }

  public async reorder(items: Array<{ id: string; displayOrder: number; parentId?: string | null }>): Promise<Result<void, never>> {
    await this.repo.reorderMenuItems(items);
    return ok(undefined);
  }
}
