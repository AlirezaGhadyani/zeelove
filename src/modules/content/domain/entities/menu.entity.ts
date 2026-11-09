import { AggregateRoot } from '@/shared/kernel/aggregate-root';
import type { MenuItem } from './menu-item.entity';

export interface MenuProps {
  id: string;
  code: string;
  title: string;
  items?: MenuItem[];
}

export class Menu extends AggregateRoot<string> {
  private _code: string;
  private _title: string;
  private _items: MenuItem[];

  constructor(props: MenuProps) {
    super(props.id);
    this._code = props.code.trim().toLowerCase();
    this._title = props.title.trim();
    this._items = props.items ? [...props.items] : [];
  }

  public get code(): string {
    return this._code;
  }

  public get title(): string {
    return this._title;
  }

  public get items(): MenuItem[] {
    return [...this._items];
  }

  public setTitle(title: string): void {
    this._title = title.trim();
  }

  public setItems(items: MenuItem[]): void {
    this._items = [...items];
  }

  public getTree(): MenuItem[] {
    const itemMap = new Map<string, MenuItem>();
    const roots: MenuItem[] = [];

    // Clone all items
    for (const item of this._items) {
      itemMap.set(item.id, { ...item, children: [] });
    }

    // Assemble tree
    for (const item of this._items) {
      const current = itemMap.get(item.id)!;
      if (item.parentId && itemMap.has(item.parentId)) {
        itemMap.get(item.parentId)!.children.push(current);
      } else {
        roots.push(current);
      }
    }

    for (const item of itemMap.values()) {
      item.children.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return roots.sort((a, b) => a.displayOrder - b.displayOrder);
  }
}
