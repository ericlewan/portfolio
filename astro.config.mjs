import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [mdx(), react(), keystatic()],
  site: 'https://yaroslav.design',
});
