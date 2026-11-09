import type { Menu } from '../../domain/entities/menu.entity';
import type { MenuItem } from '../../domain/entities/menu-item.entity';

export interface NavigationRepositoryPort {
  findByCode(code: string): Promise<Menu | null>;
  findAll(): Promise<Menu[]>;
  saveMenu(menu: Menu): Promise<void>;
  saveMenuItem(item: MenuItem): Promise<void>;
  deleteMenuItem(id: string): Promise<void>;
  reorderMenuItems(items: Array<{ id: string; displayOrder: number; parentId?: string | null }>): Promise<void>;
}
