export interface AuditDiff {
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  changes?: Record<string, { old: unknown; new: unknown }>;
}

export interface AuditEntry {
  id: string;
  adminId: string;
  action: string;
  entity: string;
  entityId: string;
  payload?: AuditDiff | null;
  ipAddress?: string | null;
  createdAt: Date;
}

export function computeDiff(
  before?: Record<string, unknown> | null,
  after?: Record<string, unknown> | null,
): AuditDiff {
  const changes: Record<string, { old: unknown; new: unknown }> = {};
  const b = before ?? {};
  const a = after ?? {};

  const allKeys = new Set([...Object.keys(b), ...Object.keys(a)]);
  for (const key of allKeys) {
    if (JSON.stringify(b[key]) !== JSON.stringify(a[key])) {
      changes[key] = { old: b[key], new: a[key] };
    }
  }

  return { before, after, changes };
}
