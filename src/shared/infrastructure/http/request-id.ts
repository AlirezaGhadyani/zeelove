import { randomUUID } from 'crypto';

export const REQUEST_ID_HEADER = 'x-request-id';

export function getOrCreateRequestId(headers: Headers): string {
  const existing = headers.get(REQUEST_ID_HEADER);
  if (existing && existing.trim().length > 0) {
    return existing;
  }
  return randomUUID();
}
