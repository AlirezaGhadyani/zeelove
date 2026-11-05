import { describe, it, expect } from 'vitest';
import { GET as healthHandler } from '@/app/api/health/route';
import { REQUEST_ID_HEADER } from '@/shared/infrastructure/http/request-id';

describe('Integration: Health Route Handler', () => {
  it('returns 200 OK with app name zeelove and request id header', async () => {
    const req = new Request('http://localhost:3000/api/health', {
      headers: {
        [REQUEST_ID_HEADER]: 'test-req-456',
      },
    });

    const res = await healthHandler(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.app).toBe('zeelove');
    expect(body.timestamp).toBeDefined();
    expect(res.headers.get(REQUEST_ID_HEADER)).toBe('test-req-456');
  });
});
