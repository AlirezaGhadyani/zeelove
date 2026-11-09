'use server';

import { revalidatePath } from 'next/cache';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CONTENT_TOKENS } from '../../infrastructure/container/register-content';
import type { CreateMenuItemInput, UpdateMenuItemInput } from '../../application/use-cases/manage-menu.use-case';

const container = createAppContainer();

export async function createMenuItemAction(input: CreateMenuItemInput) {
  const useCase = container.resolve(CONTENT_TOKENS.ManageMenuUseCase);
  const result = await useCase.createItem(input);

  if (result.isErr) {
    return { ok: false, error: result.error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/navigation');
  return { ok: true, item: result.value };
}

export async function updateMenuItemAction(input: UpdateMenuItemInput) {
  const useCase = container.resolve(CONTENT_TOKENS.ManageMenuUseCase);
  const result = await useCase.updateItem(input);

  if (result.isErr) {
    return { ok: false, error: result.error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/navigation');
  return { ok: true };
}

export async function deleteMenuItemAction(id: string) {
  const useCase = container.resolve(CONTENT_TOKENS.ManageMenuUseCase);
  await useCase.deleteItem(id);

  revalidatePath('/', 'layout');
  revalidatePath('/admin/navigation');
  return { ok: true };
}

export async function reorderMenuItemsAction(items: Array<{ id: string; displayOrder: number; parentId?: string | null }>) {
  const useCase = container.resolve(CONTENT_TOKENS.ManageMenuUseCase);
  await useCase.reorder(items);

  revalidatePath('/', 'layout');
  revalidatePath('/admin/navigation');
  return { ok: true };
}
