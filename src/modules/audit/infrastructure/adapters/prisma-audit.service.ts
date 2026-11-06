import { type PrismaClient, Prisma } from '@prisma/client';
import type {
  AuditServicePort,
  RecordAuditParams,
  ListAuditParams,
} from '../../application/ports/audit.service.port';
import { type AuditEntry, type AuditDiff, computeDiff } from '../../domain/audit-entry';

export class PrismaAuditService implements AuditServicePort {
  constructor(private readonly prisma: PrismaClient) {}

  public async record(params: RecordAuditParams): Promise<AuditEntry> {
    const diff = computeDiff(params.before, params.after);
    const created = await this.prisma.adminAuditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        payload: diff ? (diff as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        ipAddress: params.ipAddress,
      },
    });

    return {
      id: created.id,
      adminId: created.adminId,
      action: created.action,
      entity: created.entity,
      entityId: created.entityId,
      payload: created.payload as unknown as AuditDiff,
      ipAddress: created.ipAddress,
      createdAt: created.createdAt,
    };
  }

  public async list(params: ListAuditParams): Promise<{ entries: AuditEntry[]; total: number }> {
    const page = Math.max(1, params.page ?? 1);
    const perPage = Math.min(100, Math.max(1, params.perPage ?? 20));
    const skip = (page - 1) * perPage;

    const where: Record<string, unknown> = {};
    if (params.entity) where.entity = params.entity;
    if (params.action) where.action = params.action;

    const [total, records] = await Promise.all([
      this.prisma.adminAuditLog.count({ where }),
      this.prisma.adminAuditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
      }),
    ]);

    const entries: AuditEntry[] = records.map((r) => ({
      id: r.id,
      adminId: r.adminId,
      action: r.action,
      entity: r.entity,
      entityId: r.entityId,
      payload: r.payload as unknown as AuditDiff,
      ipAddress: r.ipAddress,
      createdAt: r.createdAt,
    }));

    return { entries, total };
  }
}
