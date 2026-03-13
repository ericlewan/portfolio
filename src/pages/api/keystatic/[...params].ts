import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import config from '../../../../keystatic.config';
import type { APIRoute } from 'astro';

export const ALL: APIRoute = async (context) => {
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

  // Build the generic handler the same way @keystatic/astro does internally.
  // The injected route calls makeHandler({ config }), which then spreads to
  // makeGenericAPIRouteHandler({ config, clientId, ... }).
  // We must pass { config } (wrapped), NOT { ...config } (spread), so that
  // _config.config resolves to the keystatic config object.
  const handler = makeGenericAPIRouteHandler(
    {
      config,
      clientId: import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
      secret: import.meta.env.KEYSTATIC_SECRET,
    },
    { slugEnvName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG' },
  );

  const { body, headers, status } = await handler(request);
  return new Response(body, { status, headers });
};
