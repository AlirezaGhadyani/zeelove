'use server';

import { revalidatePath } from 'next/cache';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '../../infrastructure/container/register-catalog';
import { INVENTORY_TOKENS } from '@/modules/inventory/infrastructure/container/register-inventory';
import { InventoryLevel } from '@/modules/inventory';
import type { CreateProductInput } from '../../application/use-cases/create-product.use-case';
import type { UpdateProductInput } from '../../application/use-cases/update-product.use-case';
import type { CreateCategoryInput, UpdateCategoryInput } from '../../application/use-cases/manage-categories.use-case';
import type { CreateBrandInput, UpdateBrandInput } from '../../application/use-cases/manage-brands.use-case';
import type { CreateAttributeInput, UpdateAttributeInput } from '../../application/use-cases/manage-attributes.use-case';

const container = createAppContainer();

export async function createProductAction(input: CreateProductInput) {
  const useCase = container.resolve(CATALOG_TOKENS.CreateProductUseCase);
  const result = await useCase.execute(input);

  if (result.isErr) {
    return { ok: false, error: result.error.message };
  }

  const product = result.value;

  // Initialize inventory stock levels if provided
  const inventoryRepo = container.resolve(INVENTORY_TOKENS.InventoryRepository);
  for (let i = 0; i < input.variants.length; i++) {
    const vInput = input.variants[i]!;
    const variantEntity = product.variants[i];
    if (variantEntity && vInput.initialStock !== undefined) {
      await inventoryRepo.save(
        new InventoryLevel({
          id: `inv-${Date.now()}-${i}`,
          variantId: variantEntity.id,
          quantity: Math.max(0, vInput.initialStock),
          safetyStock: 0,
        }),
      );
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/', 'layout');
  revalidatePath('/products');
  return { ok: true, productId: product.id, slug: product.slug.value };
}

export async function updateProductAction(input: UpdateProductInput) {
  const useCase = container.resolve(CATALOG_TOKENS.UpdateProductUseCase);
  const result = await useCase.execute(input);

  if (result.isErr) {
    return { ok: false, error: result.error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/', 'layout');
  revalidatePath('/products');
  return { ok: true, productId: result.value.id, slug: result.value.slug.value };
}

export async function deleteProductAction(id: string) {
  const repo = container.resolve(CATALOG_TOKENS.ProductRepository);
  await repo.delete(id);
  revalidatePath('/admin/products');
  revalidatePath('/', 'layout');
  revalidatePath('/products');
  return { ok: true };
}

export async function manageCategoryAction(
  type: 'create' | 'update' | 'delete' | 'reorder',
  payload: unknown,
) {
  const useCase = container.resolve(CATALOG_TOKENS.ManageCategoriesUseCase);

  if (type === 'create') {
    const res = await useCase.create(payload as CreateCategoryInput);
    if (res.isErr) return { ok: false, error: res.error.message };
  } else if (type === 'update') {
    const res = await useCase.update(payload as UpdateCategoryInput);
    if (res.isErr) return { ok: false, error: res.error.message };
  } else if (type === 'delete') {
    const res = await useCase.delete(payload as string);
    if (res.isErr) return { ok: false, error: res.error.message };
  } else if (type === 'reorder') {
    await useCase.reorderTree(payload as Array<{ id: string; displayOrder: number; parentId?: string | null }>);
  }

  revalidatePath('/admin/categories');
  revalidatePath('/', 'layout');
  revalidatePath('/products');
  return { ok: true };
}

export async function manageBrandAction(
  type: 'create' | 'update' | 'delete',
  payload: unknown,
) {
  const useCase = container.resolve(CATALOG_TOKENS.ManageBrandsUseCase);

  if (type === 'create') {
    const res = await useCase.create(payload as CreateBrandInput);
    if (res.isErr) return { ok: false, error: res.error.message };
  } else if (type === 'update') {
    const res = await useCase.update(payload as UpdateBrandInput);
    if (res.isErr) return { ok: false, error: res.error.message };
  } else if (type === 'delete') {
    const res = await useCase.delete(payload as string);
    if (res.isErr) return { ok: false, error: res.error.message };
  }

  revalidatePath('/admin/brands');
  revalidatePath('/', 'layout');
  revalidatePath('/products');
  return { ok: true };
}

export async function manageAttributeAction(
  type: 'create' | 'update' | 'delete',
  payload: unknown,
) {
  const useCase = container.resolve(CATALOG_TOKENS.ManageAttributesUseCase);

  if (type === 'create') {
    const res = await useCase.create(payload as CreateAttributeInput);
    if (res.isErr) return { ok: false, error: res.error.message };
  } else if (type === 'update') {
    const res = await useCase.update(payload as UpdateAttributeInput);
    if (res.isErr) return { ok: false, error: res.error.message };
  } else if (type === 'delete') {
    const res = await useCase.delete(payload as string);
    if (res.isErr) return { ok: false, error: res.error.message };
  }

  revalidatePath('/admin/attributes');
  return { ok: true };
}
