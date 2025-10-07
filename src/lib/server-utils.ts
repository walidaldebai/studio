import 'server-only';

import {NextResponse} from 'next/server';

export function getApiKey(key: string) {
  const apiKey = process.env[key];
  if (!apiKey) {
    throw new Error(`Missing ${key} environment variable`);
  }
  return apiKey;
}

export function err(e: any) {
  return NextResponse.json(
    {error: e.message},
    {
      status: 500,
    }
  );
}
