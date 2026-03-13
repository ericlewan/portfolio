import { makeHandler } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';
import type { APIContext } from 'astro';

const handler = makeHandler(config);

export const ALL = async (context: APIContext) => {
  // On Vercel, context.request.url may have 'localhost' as the origin
  // because the serverless function doesn't see the public hostname.
  // We rewrite the URL to use the canonical site origin before
  // passing it to Keystatic's handler.
  const siteOrigin = 'https://yaroslav.design';
  const originalUrl = new URL(context.request.url);

  let request = context.request;
  if (originalUrl.origin !== siteOrigin) {
    const fixedUrl = new URL(originalUrl.pathname + originalUrl.search, siteOrigin);
    request = new Request(fixedUrl.toString(), context.request);
  }

  return handler({ ...context, request });
};
