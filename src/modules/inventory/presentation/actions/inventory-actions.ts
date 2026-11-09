'use server';

import { revalidatePath } from 'next/cache';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { INVENTORY_TOKENS } from '../../infrastructure/container/register-inventory';
import { TOKENS } from '@/shared/infrastructure/container/tokens';
import type { AdjustInventoryInput } from '../../application/use-cases/adjust-inventory.use-case';
import type { BulkUpdateInventoryInput } from '../../application/use-cases/bulk-update-inventory.use-case';

const container = createAppContainer();

export async function adjustInventoryAction(input: AdjustInventoryInput) {
  const useCase = container.resolve(INVENTORY_TOKENS.AdjustInventoryUseCase);
  const result = await useCase.execute(input);

  if (result.isErr) {
    return { ok: false, error: result.error.message };
  }

  revalidatePath('/admin/inventory');
  revalidatePath('/admin/products');
  revalidatePath('/', 'layout');
  revalidatePath('/products');
  return { ok: true, quantity: result.value.quantity };
}

export async function bulkUpdateInventoryAction(input: BulkUpdateInventoryInput) {
  const useCase = container.resolve(INVENTORY_TOKENS.BulkUpdateInventoryUseCase);
  const result = await useCase.execute(input);

  if (result.isErr) {
    return { ok: false, error: 'خطا در بروزرسانی دسته‌ای موجودی' };
  }

  revalidatePath('/admin/inventory');
  revalidatePath('/admin/products');
  revalidatePath('/', 'layout');
  revalidatePath('/products');
  return { ok: true, updatedCount: result.value.updatedCount };
}

export async function exportInventoryCsvAction() {
  const prisma = container.resolve(TOKENS.Prisma);
  const variants = await prisma.productVariant.findMany({
    include: {
      product: { select: { title: true } },
      inventory: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const headers = ['variantId', 'productTitle', 'sku', 'priceToman', 'stock', 'safetyStock'];
  const rows = variants.map((v) => [
    v.id,
    `"${(v.product.title || '').replace(/"/g, '""')}"`,
    v.sku,
    v.price,
    v.inventory?.quantity ?? 0,
    v.inventory?.safetyStock ?? 0,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  return { ok: true, csv };
}

export async function importInventoryCsvAction(csvContent: string) {
  const lines = csvContent.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length <= 1) {
    return { ok: false, error: 'فایل CSV خالی یا نامعتبر است' };
  }

  const header = lines[0]!.split(',').map((h) => h.trim().toLowerCase());
  const variantIdIdx = header.indexOf('variantid');
  const skuIdx = header.indexOf('sku');
  const stockIdx = header.indexOf('stock');
  const priceIdx = header.indexOf('pricetoman');

  if (variantIdIdx === -1 && skuIdx === -1) {
    return { ok: false, error: 'ستون variantId یا sku در فایل CSV یافت نشد' };
  }

  const prisma = container.resolve(TOKENS.Prisma);
  const useCase = container.resolve(INVENTORY_TOKENS.BulkUpdateInventoryUseCase);

  const itemsToUpdate: Array<{ variantId: string; quantity: number }> = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i]!.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
    let vId = variantIdIdx !== -1 ? cols[variantIdIdx] : undefined;
    const sku = skuIdx !== -1 ? cols[skuIdx] : undefined;
    const stockStr = stockIdx !== -1 ? cols[stockIdx] : undefined;
    const priceStr = priceIdx !== -1 ? cols[priceIdx] : undefined;

    if (!vId && sku) {
      const v = await prisma.productVariant.findUnique({ where: { sku } });
      if (v) vId = v.id;
    }

    if (vId) {
      if (stockStr !== undefined && !Number.isNaN(Number(stockStr))) {
        itemsToUpdate.push({
          variantId: vId,
          quantity: Math.max(0, parseInt(stockStr, 10)),
        });
      }
      if (priceStr !== undefined && !Number.isNaN(Number(priceStr))) {
        const pNum = Math.max(0, parseInt(priceStr, 10));
        await prisma.productVariant.update({
          where: { id: vId },
          data: { price: pNum },
        });
      }
    }
  }

  if (itemsToUpdate.length > 0) {
    await useCase.execute({
      items: itemsToUpdate,
      reason: 'CSV_IMPORT',
      note: 'بروزرسانی از طریق ایمپورت فایل CSV',
    });
  }

  revalidatePath('/admin/inventory');
  revalidatePath('/admin/products');
  return { ok: true, importedCount: itemsToUpdate.length };
}
