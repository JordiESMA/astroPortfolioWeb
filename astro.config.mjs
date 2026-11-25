import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jordiesma.github.io',
  base: process.env.GITHUB_PAGES === 'true' ? '/astroPortfolioWeb/' : '/',
  trailingSlash: 'always',
});
