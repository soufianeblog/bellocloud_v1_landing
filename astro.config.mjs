// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://bellocloud.com',
  integrations: [
    sitemap({
      // Only list canonical (language-prefixed) URLs — the language-less
      // routes (/, /contact/, …) are duplicates whose canonical points at
      // the /<defaultLang>/ version.
      filter: (page) => ['en', 'fr', 'ar'].some((lang) => new URL(page).pathname.startsWith(`/${lang}/`)),
    }),
  ],
  build: {
    // Inline all CSS into the HTML: one fewer render-blocking request.
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
