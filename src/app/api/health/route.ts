import { NextResponse } from 'next/server';
import { env } from '@/shared/infrastructure/config/env';
import { getOrCreateRequestId, REQUEST_ID_HEADER } from '@/shared/infrastructure/http/request-id';

export async function GET(request: Request) {
  const requestId = getOrCreateRequestId(request.headers);

  const payload = {
    status: 'ok',
    app: env.APP_NAME,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      [REQUEST_ID_HEADER]: requestId,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
