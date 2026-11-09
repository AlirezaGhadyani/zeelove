import { INITIAL_IN_MEMORY_SEEDS } from './prisma-in-memory-seed';

export type FallbackHandler = (...args: unknown[]) => Promise<unknown>;

declare global {
  var __prismaInMemoryStore: Map<string, Map<string, Record<string, unknown>>> | undefined;
}

const inMemoryDb =
  globalThis.__prismaInMemoryStore ?? new Map<string, Map<string, Record<string, unknown>>>();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prismaInMemoryStore = inMemoryDb;
}

function getModelStore(modelName: string): Map<string, Record<string, unknown>> {
  const normalized = modelName.toLowerCase();
  let store = inMemoryDb.get(normalized);
  if (!store) {
    store = new Map();
    inMemoryDb.set(normalized, store);
    const initialSeeds = INITIAL_IN_MEMORY_SEEDS[normalized];
    if (initialSeeds && Array.isArray(initialSeeds)) {
      for (const rec of initialSeeds) {
        const id = (rec.id as string) || (rec.key as string);
        if (id) store.set(id, { ...rec });
      }
    }
  }
  return store;
}

function matchesWhere(item: Record<string, unknown>, where?: Record<string, unknown>): boolean {
  if (!where || Object.keys(where).length === 0) return true;
  for (const [key, expected] of Object.entries(where)) {
    if (key === 'OR' && Array.isArray(expected)) {
      if (!expected.some((cond) => matchesWhere(item, cond as Record<string, unknown>))) return false;
      continue;
    }
    if (key === 'AND' && Array.isArray(expected)) {
      if (!expected.every((cond) => matchesWhere(item, cond as Record<string, unknown>))) return false;
      continue;
    }
    if (key === 'variants') {
      const vars = Array.from(getModelStore('productvariant').values()).filter((v) => v.productId === item.id);
      if (vars.length === 0) return false;
      continue;
    }
    const actual = item[key];
    if (typeof expected === 'object' && expected !== null) {
      const expObj = expected as Record<string, unknown>;
      if ('contains' in expObj && typeof actual === 'string' && typeof expObj.contains === 'string') {
        if (!actual.toLowerCase().includes(expObj.contains.toLowerCase())) return false;
        continue;
      }
      if ('equals' in expObj) {
        if (actual !== expObj.equals) return false;
        continue;
      }
    }
    if (actual !== expected) return false;
  }
  return true;
}

function attachIncludes(
  modelName: string,
  item: Record<string, unknown>,
  include?: Record<string, unknown>,
): Record<string, unknown> {
  if (!include || typeof include !== 'object') return item;
  const result = { ...item };
  const m = modelName.toLowerCase();
  if (m === 'navigationmenu' && include.items) {
    const items = Array.from(getModelStore('navigationmenuitem').values())
      .filter((i) => i.menuId === item.id && i.isActive !== false);
    items.sort((a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0));
    result.items = items;
  }
  if (m === 'product') {
    if (include.variants) {
      result.variants = Array.from(getModelStore('productvariant').values()).filter((v) => v.productId === item.id);
    }
    if (include.images) {
      result.images = Array.from(getModelStore('productimage').values()).filter((img) => img.productId === item.id);
    }
    if (include.category && item.categoryId) {
      result.category = getModelStore('category').get(item.categoryId as string);
    }
    if (include.brand && item.brandId) {
      result.brand = getModelStore('brand').get(item.brandId as string);
    }
  }
  if (m === 'category' && include.children) {
    result.children = Array.from(getModelStore('category').values()).filter((c) => c.parentId === item.id);
  }
  return result;
}

export function createModelFallback(modelName: string): Record<string, FallbackHandler> {
  const store = getModelStore(modelName);

  return {
    findMany: async (arg?: unknown) => {
      const options = (arg as { where?: Record<string, unknown>; skip?: number; take?: number; orderBy?: Record<string, 'asc' | 'desc'>; include?: Record<string, unknown> }) || {};
      const items = Array.from(store.values()).filter((item) => matchesWhere(item, options.where));
      if (options.orderBy) {
        const [field, direction] = Object.entries(options.orderBy)[0] ?? [];
        if (field) {
          items.sort((a, b) => {
            const va = (a[field] as number | string | Date) ?? 0;
            const vb = (b[field] as number | string | Date) ?? 0;
            if (va < vb) return direction === 'asc' ? -1 : 1;
            if (va > vb) return direction === 'asc' ? 1 : -1;
            return 0;
          });
        }
      }
      const skip = options.skip ?? 0;
      const take = options.take !== undefined ? options.take : items.length;
      return items.slice(skip, skip + take).map((it) => attachIncludes(modelName, it, options.include));
    },
    findFirst: async (arg?: unknown) => {
      const options = (arg as { where?: Record<string, unknown>; include?: Record<string, unknown> }) || {};
      const found = Array.from(store.values()).find((item) => matchesWhere(item, options.where));
      return found ? attachIncludes(modelName, { ...found }, options.include) : null;
    },
    findUnique: async (arg?: unknown) => {
      const options = (arg as { where?: Record<string, unknown>; include?: Record<string, unknown> }) || {};
      const found = Array.from(store.values()).find((item) => matchesWhere(item, options.where));
      return found ? attachIncludes(modelName, { ...found }, options.include) : null;
    },
    count: async (arg?: unknown) => {
      const options = (arg as { where?: Record<string, unknown> }) || {};
      return Array.from(store.values()).filter((item) => matchesWhere(item, options.where)).length;
    },
    create: async (arg: unknown) => {
      const data = typeof arg === 'object' && arg !== null && 'data' in arg ? { ...((arg as { data: Record<string, unknown> }).data) } : {};
      const id = (data.id as string) || `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const now = new Date();
      const record = { id, createdAt: now, updatedAt: now, ...data };
      store.set(id, record);
      return { ...record };
    },
    update: async (arg: unknown) => {
      const where = typeof arg === 'object' && arg !== null && 'where' in arg ? (arg as { where: Record<string, unknown> }).where : {};
      const data = typeof arg === 'object' && arg !== null && 'data' in arg ? { ...((arg as { data: Record<string, unknown> }).data) } : {};
      const existing = Array.from(store.values()).find((item) => matchesWhere(item, where));
      if (!existing) {
        const id = (where.id as string) || `id-${Date.now()}`;
        const record = { id, updatedAt: new Date(), ...data };
        store.set(id, record);
        return { ...record };
      }
      const updated = { ...existing, ...data, updatedAt: new Date() };
      store.set(existing.id as string, updated);
      return { ...updated };
    },
    upsert: async (arg: unknown) => {
      const where = typeof arg === 'object' && arg !== null && 'where' in arg ? (arg as { where: Record<string, unknown> }).where : {};
      const create = typeof arg === 'object' && arg !== null && 'create' in arg ? (arg as { create: Record<string, unknown> }).create : {};
      const update = typeof arg === 'object' && arg !== null && 'update' in arg ? (arg as { update: Record<string, unknown> }).update : {};
      const existing = Array.from(store.values()).find((item) => matchesWhere(item, where));
      if (existing) {
        const updated = { ...existing, ...update, updatedAt: new Date() };
        store.set(existing.id as string, updated);
        return { ...updated };
      }
      const id = (create.id as string) || (where.id as string) || `id-${Date.now()}`;
      const record = { id, createdAt: new Date(), updatedAt: new Date(), ...create };
      store.set(id, record);
      return { ...record };
    },
    delete: async (arg: unknown) => {
      const where = typeof arg === 'object' && arg !== null && 'where' in arg ? (arg as { where: Record<string, unknown> }).where : {};
      const existing = Array.from(store.values()).find((item) => matchesWhere(item, where));
      if (existing) {
        store.delete(existing.id as string);
        return { ...existing };
      }
      return {};
    },
    deleteMany: async (arg?: unknown) => {
      const where = typeof arg === 'object' && arg !== null && 'where' in arg ? (arg as { where?: Record<string, unknown> }).where : undefined;
      let count = 0;
      for (const [id, item] of Array.from(store.entries())) {
        if (matchesWhere(item, where)) {
          store.delete(id);
          count++;
        }
      }
      return { count };
    },
  };
}
