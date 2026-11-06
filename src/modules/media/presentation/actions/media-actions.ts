'use server';

import { prisma } from '@/shared/infrastructure/database/prisma';
import { LocalStorageAdapter } from '../../infrastructure/adapters/local-storage.adapter';
import { PrismaMediaRepository } from '../../infrastructure/adapters/prisma-media.repository';
import { UploadMediaUseCase } from '../../application/use-cases/upload-media.use-case';
import { ListMediaUseCase } from '../../application/use-cases/list-media.use-case';
import { DeleteMediaUseCase } from '../../application/use-cases/delete-media.use-case';
import { PrismaAuditService } from '@/modules/audit';
import {
  getSessionToken,
  IDENTITY_TOKENS,
  requirePermission,
  PERMISSIONS,
} from '@/modules/identity-access';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';

const storage = new LocalStorageAdapter();
const mediaRepo = new PrismaMediaRepository(prisma);
const uploadUseCase = new UploadMediaUseCase(storage, mediaRepo);
const listUseCase = new ListMediaUseCase(mediaRepo);
const deleteUseCase = new DeleteMediaUseCase(storage, mediaRepo);
const auditService = new PrismaAuditService(prisma);

async function getAuthenticatedAdmin() {
  const token = await getSessionToken();
  const container = createAppContainer();
  const getCurrentUser = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
  const userRes = await getCurrentUser.execute({ sessionToken: token || '' });
  if (userRes.isErr || !userRes.value) {
    throw new Error('برای این عملیات احراز هویت الزامی است.');
  }
  return requirePermission(userRes.value, PERMISSIONS.ADMIN_ACCESS);
}

export async function uploadMediaAction(formData: FormData) {
  const admin = await getAuthenticatedAdmin();
  const file = formData.get('file') as File | null;
  const rawFolder = (formData.get('folder') as string) || 'general';
  const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || 'general';
  const altText = ((formData.get('altText') as string) || '').slice(0, 200);

  if (!file) {
    return { ok: false, error: 'هیچ فایلی انتخاب نشده است.' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const media = await uploadUseCase.execute({
      fileBuffer: buffer,
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      folder,
      altText,
    });

    await auditService.record({
      adminId: admin.id,
      action: 'MEDIA_UPLOAD',
      entity: 'Media',
      entityId: media.id,
      after: { filename: media.filename, originalName: media.originalName, size: media.size },
    });

    return { ok: true, media: { id: media.id, url: media.url, altText: media.altText } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'خطا در بارگذاری فایل';
    return { ok: false, error: message };
  }
}

export async function listMediaAction(params: { folder?: string; search?: string; page?: number }) {
  await getAuthenticatedAdmin();
  const sanitizedFolder = params.folder?.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50);
  const result = await listUseCase.execute({ ...params, folder: sanitizedFolder });
  return {
    items: result.items.map((m) => ({
      id: m.id,
      filename: m.filename,
      originalName: m.originalName,
      mimeType: m.mimeType,
      size: m.size,
      width: m.width,
      height: m.height,
      altText: m.altText,
      folder: m.folder,
      url: m.url,
      thumbnailUrl: m.thumbnailUrl,
      createdAt: m.createdAt.toISOString(),
    })),
    total: result.total,
    folders: result.folders,
  };
}

export async function deleteMediaAction(id: string) {
  const admin = await getAuthenticatedAdmin();
  const existing = await mediaRepo.findById(id);
  const success = await deleteUseCase.execute(id);
  if (success && existing) {
    await auditService.record({
      adminId: admin.id,
      action: 'MEDIA_DELETE',
      entity: 'Media',
      entityId: id,
      before: { filename: existing.filename, url: existing.url },
    });
  }
  return { ok: success };
}
