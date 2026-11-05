import { test, expect } from '@playwright/test';

test.describe('E2E: System Health Endpoint', () => {
  test('serves 200 OK on /api/health with status ok and app zeelove', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.app).toBe('zeelove');
    expect(body.timestamp).toBeDefined();
  });
});
