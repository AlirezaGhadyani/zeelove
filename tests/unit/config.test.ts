import { describe, it, expect } from 'vitest';
import { env } from '@/shared/infrastructure/config/env';
import { getOrCreateRequestId, REQUEST_ID_HEADER } from '@/shared/infrastructure/http/request-id';

describe('Unit: Infrastructure Config & HTTP Helpers', () => {
  it('loads valid environment configuration with default app name zeelove', () => {
    expect(env.APP_NAME).toBe('zeelove');
    expect(env.PORT).toBeGreaterThan(0);
    expect(env.NODE_ENV).toBeDefined();
  });

  it('generates a new request id when header is missing', () => {
    const headers = new Headers();
    const id = getOrCreateRequestId(headers);
    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThan(0);
  });

  it('preserves existing request id from headers', () => {
    const headers = new Headers();
    headers.set(REQUEST_ID_HEADER, 'req-custom-123');
    const id = getOrCreateRequestId(headers);
    expect(id).toBe('req-custom-123');
  });
});
