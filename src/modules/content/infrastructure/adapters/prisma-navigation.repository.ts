import type { PrismaClient } from '@prisma/client';
import type { NavigationRepositoryPort } from '../../application/ports/navigation.repository.port';
import { Menu } from '../../domain/entities/menu.entity';
import { MenuItem } from '../../domain/entities/menu-item.entity';

export class PrismaNavigationRepository implements NavigationRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async findByCode(code: string): Promise<Menu | null> {
    const record = await this.prisma.navigationMenu.findUnique({
      where: { code: code.trim().toLowerCase() },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!record) return null;

    const items = (record.items ?? []).map(
      (i) =>
        new MenuItem({
          id: i.id,
          menuId: i.menuId,
          parentId: i.parentId,
          title: i.title,
          url: i.url,
          target: i.target ?? '_self',
          displayOrder: i.displayOrder,
          isActive: i.isActive,
        }),
    );

    return new Menu({
      id: record.id,
      code: record.code,
      title: record.title,
      items,
    });
  }

  public async findAll(): Promise<Menu[]> {
    const records = await this.prisma.navigationMenu.findMany({
      include: {
        items: { orderBy: { displayOrder: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return records.map(
      (r) =>
        new Menu({
          id: r.id,
          code: r.code,
          title: r.title,
          items: (r.items ?? []).map(
            (i) =>
              new MenuItem({
                id: i.id,
                menuId: i.menuId,
                parentId: i.parentId,
                title: i.title,
                url: i.url,
                target: i.target ?? '_self',
                displayOrder: i.displayOrder,
                isActive: i.isActive,
              }),
          ),
        }),
    );
  }

  public async saveMenu(menu: Menu): Promise<void> {
    await this.prisma.navigationMenu.upsert({
      where: { code: menu.code },
      create: {
        id: menu.id,
        code: menu.code,
        title: menu.title,
      },
      update: {
        title: menu.title,
      },
    });
  }

  public async saveMenuItem(item: MenuItem): Promise<void> {
    const existing = await this.prisma.navigationMenuItem.findUnique({ where: { id: item.id } });

    if (existing) {
      await this.prisma.navigationMenuItem.update({
        where: { id: item.id },
        data: {
          title: item.title,
          url: item.url,
          target: item.target,
          parentId: item.parentId,
          displayOrder: item.displayOrder,
          isActive: item.isActive,
        },
      });
    } else {
      await this.prisma.navigationMenuItem.create({
        data: {
          id: item.id,
          menuId: item.menuId,
          parentId: item.parentId,
          title: item.title,
          url: item.url,
          target: item.target,
          displayOrder: item.displayOrder,
          isActive: item.isActive,
        },
      });
    }
  }

  public async deleteMenuItem(id: string): Promise<void> {
    await this.prisma.navigationMenuItem.delete({ where: { id } });
  }

  public async reorderMenuItems(items: Array<{ id: string; displayOrder: number; parentId?: string | null }>): Promise<void> {
    await this.prisma.$transaction(
      items.map((i) =>
        this.prisma.navigationMenuItem.update({
          where: { id: i.id },
          data: {
            displayOrder: i.displayOrder,
            ...(i.parentId !== undefined ? { parentId: i.parentId } : {}),
          },
        }),
      ),
    );
  }
}
