'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/primitives/card';
import {
  deleteMenuItemAction,
  reorderMenuItemsAction,
} from '@/modules/content/presentation/actions/navigation-actions';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { MenuItemModal, type AdminMenuItemData } from './menu-item-modal';

export interface AdminMenuData {
  id: string;
  code: string;
  title: string;
  items: AdminMenuItemData[];
}

export function NavigationClient({ initialMenus }: { initialMenus: AdminMenuData[] }) {
  const [menus, setMenus] = useState<AdminMenuData[]>(initialMenus);
  const [selectedCode, setSelectedCode] = useState<string>(initialMenus[0]?.code ?? 'header_main');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminMenuItemData | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);

  const currentMenu = menus.find((m) => m.code === selectedCode) ?? menus[0];
  const items = currentMenu?.items ?? [];
  const rootItems = items.filter((i) => !i.parentId);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`آیا از حذف آیتم "${title}" اطمینان دارید؟`)) return;
    const res = await deleteMenuItemAction(id);
    if (!res.ok) {
      toast.error('خطا در حذف آیتم منو');
      return;
    }
    toast.success('آیتم منو با موفقیت حذف شد');
    setMenus((prev) =>
      prev.map((m) =>
        m.id === currentMenu?.id
          ? { ...m, items: m.items.filter((i) => i.id !== id) }
          : m,
      ),
    );
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= rootItems.length) return;

    const next = [...rootItems];
    const temp = next[index]!;
    next[index] = next[targetIdx]!;
    next[targetIdx] = temp;

    const reordered = next.map((it, i) => ({ ...it, displayOrder: i }));

    await reorderMenuItemsAction(
      reordered.map((i) => ({ id: i.id, displayOrder: i.displayOrder, parentId: i.parentId })),
    );

    toast.success('ترتیب منو ذخیره شد');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">مدیریت منوهای ناوبری</h2>
          <p className="text-sm text-muted-foreground">ساختار منوی اصلی هدر، پاورقی و لینک‌های فروشگاه</p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setDefaultParentId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          افزودن آیتم جدید
        </Button>
      </div>

      <div className="flex gap-2 border-b border-border/60 pb-2 overflow-x-auto">
        {menus.map((m) => (
          <button
            key={m.code}
            type="button"
            onClick={() => setSelectedCode(m.code)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCode === m.code
                ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {m.title} ({m.code})
          </button>
        ))}
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>آیتم‌های منو ({toPersianDigits(items.length)})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rootItems.map((root, idx) => {
            const children = items.filter((i) => i.parentId === root.id);
            return (
              <div key={root.id} className="border border-border/60 rounded-lg p-3 bg-card/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{root.title}</span>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded" dir="ltr">
                      {root.url}
                    </span>
                    {root.target === '_blank' && <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />}
                    {!root.isActive && (
                      <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">غیرفعال</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleMove(idx, 'up')} disabled={idx === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleMove(idx, 'down')} disabled={idx === rootItems.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingItem(null);
                        setDefaultParentId(root.id);
                        setIsModalOpen(true);
                      }}
                      className="text-xs"
                    >
                      + زیرمنو
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setEditingItem(root); setIsModalOpen(true); }}>
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(root.id, root.title)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {children.length > 0 && (
                  <div className="mr-6 border-r-2 border-border/80 pr-4 space-y-1.5 pt-1">
                    {children.map((child) => (
                      <div key={child.id} className="flex items-center justify-between p-2 rounded bg-muted/40 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{child.title}</span>
                          <span className="font-mono text-muted-foreground" dir="ltr">{child.url}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingItem(child); setIsModalOpen(true); }}>
                            <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(child.id, child.title)}>
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {currentMenu && (
        <MenuItemModal
          key={editingItem?.id ?? defaultParentId ?? selectedCode}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          menuId={currentMenu.id}
          editingItem={editingItem}
          allItems={items}
          defaultParentId={defaultParentId}
        />
      )}
    </div>
  );
}
