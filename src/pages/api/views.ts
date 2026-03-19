import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

const headers = { 'Content-Type': 'application/json' };

function getRedis() {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const GET: APIRoute = async ({ url }) => {
  const path = url.searchParams.get('path');
  if (!path) return new Response(JSON.stringify({ views: 0 }), { headers });
  try {
    const redis = getRedis();
    if (!redis) return new Response(JSON.stringify({ views: 0 }), { headers });
    const views = await redis.get<number>(`views:${path}`) ?? 0;
    return new Response(JSON.stringify({ views }), { headers });
  } catch {
    return new Response(JSON.stringify({ views: 0 }), { headers });
  }
};

export const POST: APIRoute = async ({ url }) => {
  const path = url.searchParams.get('path');
  if (!path) return new Response(JSON.stringify({ views: 0 }), { status: 400, headers });
  try {
    const redis = getRedis();
    if (!redis) return new Response(JSON.stringify({ views: 0 }), { headers });
    const views = await redis.incr(`views:${path}`);
    return new Response(JSON.stringify({ views }), { headers });
  } catch {
    return new Response(JSON.stringify({ views: 0 }), { headers });
  }
};
