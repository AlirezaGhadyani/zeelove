import { describe, it, expect } from 'vitest';
import { Menu } from '@/modules/content/domain/entities/menu.entity';
import { MenuItem } from '@/modules/content/domain/entities/menu-item.entity';

describe('Navigation Domain (Menu & MenuItem)', () => {
  it('creates a MenuItem correctly', () => {
    const item = new MenuItem({
      id: 'item-1',
      menuId: 'menu-1',
      title: '  پوشاک مردانه  ',
      url: '  /category/men  ',
      displayOrder: 1,
      isActive: true,
    });

    expect(item.id).toBe('item-1');
    expect(item.title).toBe('پوشاک مردانه');
    expect(item.url).toBe('/category/men');
    expect(item.target).toBe('_self');
    expect(item.isActive).toBe(true);
    expect(item.children).toEqual([]);
  });

  it('builds a hierarchical tree from flat items in Menu aggregate', () => {
    const root1 = new MenuItem({
      id: 'root-1',
      menuId: 'menu-header',
      title: 'پوشاک مردانه',
      url: '/category/men',
      displayOrder: 0,
      isActive: true,
    });

    const root2 = new MenuItem({
      id: 'root-2',
      menuId: 'menu-header',
      title: 'پوشاک زنانه',
      url: '/category/women',
      displayOrder: 1,
      isActive: true,
    });

    const child1 = new MenuItem({
      id: 'child-1',
      menuId: 'menu-header',
      parentId: 'root-1',
      title: 'پیراهن مردانه',
      url: '/category/men-shirts',
      displayOrder: 0,
      isActive: true,
    });

    const child2 = new MenuItem({
      id: 'child-2',
      menuId: 'menu-header',
      parentId: 'root-1',
      title: 'شلوار کتان',
      url: '/category/men-pants',
      displayOrder: 1,
      isActive: true,
    });

    const menu = new Menu({
      id: 'menu-header',
      code: 'HEADER_MAIN',
      title: 'منوی اصلی',
      items: [root2, root1, child2, child1],
    });

    expect(menu.code).toBe('header_main');
    const tree = menu.getTree();

    expect(tree).toHaveLength(2);
    expect(tree[0]!.id).toBe('root-1');
    expect(tree[0]!.children).toHaveLength(2);
    expect(tree[0]!.children[0]!.title).toBe('پیراهن مردانه');
    expect(tree[0]!.children[1]!.title).toBe('شلوار کتان');

    expect(tree[1]!.id).toBe('root-2');
    expect(tree[1]!.children).toHaveLength(0);
  });
});
