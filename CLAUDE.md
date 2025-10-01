# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal blog built with Nuxt 3 (SSR disabled for static deployment), deployed to GitHub Pages. Content is managed via Contentful CMS. The blog features article listing with pagination, tag-based filtering, archives by year/month, and syntax highlighting for code blocks.

## Common Commands

### Development
```bash
npm run dev              # Start dev server at localhost:3000
npm run build            # Build for production
npm run start            # Start production server
npm run generate         # Generate static site (auto-runs prebuild to generate routes)
```

### Code Quality
```bash
npm run lint             # Run all linters (JS + CSS)
npm run lint:js          # ESLint for .js/.vue files
npm run lint:css         # Stylelint for CSS/SCSS/SASS and Vue styles
```

### Deployment
```bash
npm run deploy           # Deploy to GitHub Pages (master branch)
npm run deploy:ci        # CI deployment (requires GITHUB_TOKEN env var)
```

### Build Lifecycle
- `npm run prebuild` - Auto-runs before build, executes `scripts/generateRoutes.mjs` to fetch all articles/tags from Contentful and generate `scripts/generate-routes.json` for static route pre-rendering
- `npm run generate` - Internally calls prebuild, then uses the generated routes for Nitro prerendering

## Architecture

### Content Management Flow

1. **Content Source**: Contentful CMS
   - Space ID and access token configured in `config/index.mjs`
   - Content type: `post` (articles)
   - Fields: id, createDate, title, slug, categoryList, content

2. **Route Generation** (`scripts/generateRoutes.mjs`)
   - Queries Contentful for all articles and tags
   - Generates paginated routes for:
     - Home page pagination: `/page/2`, `/page/3`, etc.
     - Individual articles: `/article/{id}`
     - Tag pages: `/tag/{tag}` and `/tag/{tag}/{page}`
     - Archives: `/archives`
   - Outputs to `scripts/generate-routes.json`
   - nuxt.config.ts reads this file to configure Nitro prerender routes

3. **Static Site Generation**
   - SSR disabled (`ssr: false` in nuxt.config.ts)
   - Nitro output dir: `dist/`
   - All routes pre-rendered during `nuxi generate`

### Key Directories

- `pages/` - Nuxt file-based routing
  - `index.vue` - Home page (article list)
  - `page/[page].vue` - Pagination for article list
  - `article/[id].vue` - Individual article page
  - `tag/[tag]/[[page]].vue` - Tag filtering with optional pagination
  - `archives/index.vue` - Articles grouped by year/month
  - `about/index.vue` - About page

- `services/api.js` - Contentful API wrapper
  - `getArticles(limit, skip)` - Fetch articles with pagination
  - `getArticlesWithTag(tag, limit, skip)` - Filter by tag
  - `getArticleById(id)` - Single article
  - `getArticlesGroupByYearMonth(year, limit, skip)` - Archives
  - `getPrevAndNextArticleById(id, createDate)` - Navigation links
  - All methods return promises and handle errors gracefully

- `plugins/` - Nuxt plugins
  - `contentful.js` - Initializes Contentful client from runtime config, provides via `$contentfulClient`
  - `filters.js` - Global filters (date formatting, etc.)
  - `bootstrap-vue-next.js` - Bootstrap integration
  - `disqus.js` - Comment system
  - `font-awesome.js` - Icon system
  - `motion.js` - Animation library

- `config/index.mjs` - Centralized configuration
  - Site metadata (title, description, domain)
  - Contentful credentials (CTF_SPACE_ID, CTF_CDA_ACCESS_TOKEN, CTF_BLOG_POST_TYPE_ID)
  - Pagination limit (`articleListMaxLimit: 20`)

### Configuration Points

- **Environment Variables**: Can override Contentful config via `CTF_SPACE_ID`, `CTF_CDA_ACCESS_TOKEN`, `CTF_BLOG_POST_TYPE_ID` env vars
- **Runtime Config**: Exposed to client via `useRuntimeConfig().public`
- **SCSS**: Global SCSS variables/mixins/functions auto-imported in all components via Vite config
- **Code Highlighting**: highlight.js with VS theme
- **Custom Elements**: `<motion-div>` registered as custom element for animation

### Deployment Architecture

1. `npm run generate` creates static files in `dist/`
2. `gh-pages` package deploys `dist/` to `master` branch
3. GitHub Pages serves from `master` branch
4. Sitemap files are deleted before deployment (handled in predeploy script)

## Important Notes

- **SSR is disabled**: This is a purely static site for GitHub Pages
- **Routes must be pre-generated**: Any new dynamic route pattern must be handled in `scripts/generateRoutes.mjs`
- **Contentful is the single source of truth**: Articles are not stored locally
- **Build requires network**: Route generation needs Contentful API access during build time
- **Pagination is configurable**: Change `articleListMaxLimit` in `config/index.mjs` to adjust posts per page
- **ESLint/Prettier conflict**: Prettier is integrated via eslint-plugin-prettier to avoid formatting conflicts