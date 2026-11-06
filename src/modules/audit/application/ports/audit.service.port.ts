import type { AuditEntry } from '../../domain/audit-entry';

export interface RecordAuditParams {
  adminId: string;
  action: string;
  entity: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ipAddress?: string | null;
}

export interface ListAuditParams {
  page?: number;
  perPage?: number;
  entity?: string;
  action?: string;
}

export interface AuditServicePort {
  record(params: RecordAuditParams): Promise<AuditEntry>;
  list(params: ListAuditParams): Promise<{ entries: AuditEntry[]; total: number }>;
}
