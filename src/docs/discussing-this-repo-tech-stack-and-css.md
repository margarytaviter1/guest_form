# Discussing This Repo Tech Stack and CSS

## 1. Technologies & Skills Used in This Repo

### 🏗️ Core Technologies
- **React 18** — SPA frontend framework
- **TypeScript** (4.9) — Static typing with strict mode enabled
- **Redux** (react-redux, redux-thunk, redux-mock-store) — State management
- **Zustand** — Lightweight state management (used alongside Redux)
- **React Router v6** — Client-side routing
- **TanStack React Query v5** — Server state / async data fetching & caching

### 📦 Build & Bundling
- **Webpack 5** — Module bundling (custom config)
- **Babel** — Transpilation (presets: env, react, typescript)
- **PostCSS** — CSS processing (nesting, mixins, inline SVG, preset-env)
- **Sass/SCSS** — CSS preprocessor
- **Mini CSS Extract Plugin** — CSS extraction for production

### ✅ Testing
- **Jest 29** — Unit & integration testing
- **React Testing Library** — Component testing (`@testing-library/react`, `user-event`, `jest-dom`)
- **Stryker Mutator** — Mutation testing
- **Cypress** — E2E testing (dedicated `cypress/` and `e2e/cypress/` dirs)
- **Playwright** — E2E testing (`e2e/playwright/`)
- **WebdriverIO (WDIO)** — E2E testing (`e2e/wdio/`)
- **Nock** — HTTP mocking for tests
- **SonarQube** — Code quality & coverage analysis (`sonar-project.properties`)

### 🔧 Code Quality & DX
- **ESLint** — Linting (with plugins: react, react-hooks, import, jest, testing-library, cypress, prettier, simple-import-sort)
- **Prettier** — Code formatting
- **TypeScript strict mode** — `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc.
- **Husky + lint-staged** — Git hooks / pre-commit checks
- **Webpack Bundle Analyzer** — Bundle size analysis

### 🔌 API & Data
- **OpenAPI / Swagger** — API spec-driven development (code generation from OpenAPI specs)
- **openapi-typescript-codegen** — Auto-generating TypeScript types from API schemas
- **JSON Server** — Mock REST API for local development
- **isomorphic-fetch** — HTTP requests
- **query-string** — URL query parameter handling

### 📊 Visualization & UI
- **Victory** — Data visualization / charting library
- **@amiga-fwk-web** — Inditex internal UI framework (components, charts, CLI, tools)
- **@itx-product/all** — Inditex product component library
- **greta-web-components** — Project-specific shared component library
- **react-resizable** — Resizable UI elements
- **react-transition-group** — CSS transitions/animations
- **react-intersection-observer** — Lazy loading / scroll detection
- **XLSX** — Excel file generation/parsing
- **file-saver** — Client-side file downloads

### ☁️ DevOps & Infrastructure
- **YAML-based configuration** — `application.yml`, `deployments.yml`, `configmap`
- **PaaS deployment** — `paas/` config with deployment manifests
- **CI/CD pipelines** — Scripts for verify, promote, release, publish workflows
- **Monitoring & Alerting** — `monit/` with alert configs
- **SLM (Service Level Management)** — `slm/` directory

### 🧠 Skills & Patterns
- **Single Page Application (SPA) architecture**
- **Micro-frontend awareness** (Amiga framework)
- **Feature-based folder structure** (order-create, order-details, orders-search, etc.)
- **Domain-Driven Design** concepts (order management, reoperable articles, configuration)
- **Internationalization (i18n)** — `messages/` directory, `@formatjs/intl-numberformat`
- **Code generation** from API specs
- **Multi-layer testing strategy** (unit → mutation → E2E with 3 frameworks)
- **Module aliasing** (`@/*` path mapping)
- **Release management** (SNAPSHOT versioning, semantic versioning)
- **Monorepo-adjacent structure** (shared configs, multiple test frameworks)

---

## 2. CSS Approaches in Frontend Development

There are several categories of working with CSS:

### 2.1 Plain CSS (Vanilla CSS)
The native browser standard, no tooling required.

```css
.button {
  background-color: blue;
  color: white;
  padding: 8px 16px;
}
```

✅ No build step, universal support, modern CSS now has nesting & variables
❌ No functions/mixins, harder to scale in large projects

### 2.2 CSS Preprocessors (Sass/SCSS, Less, Stylus)

These extend CSS with programming features and **compile down to plain CSS** at build time.

#### Sass / SCSS
Sass has two syntaxes:
- **Sass** — indentation-based (no braces/semicolons)
- **SCSS** — superset of CSS (braces & semicolons, more popular)

```scss
// SCSS syntax
$primary: blue;

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  background-color: $primary;
  padding: 8px 16px;
  @include flex-center;

  &:hover {
    background-color: darken($primary, 10%);
  }

  &__icon {  // BEM-style nesting
    margin-right: 4px;
  }
}
```

```sass
// Sass (indented) syntax — same logic, no braces
$primary: blue

.button
  background-color: $primary
  padding: 8px 16px

  &:hover
    background-color: darken($primary, 10%)
```

✅ Variables, mixins, functions, nesting, partials/imports, huge ecosystem
❌ Requires build step, extra tooling, can lead to deeply nested output

#### Less
Similar to SCSS but uses `@` for variables and has slightly different function syntax.

```less
@primary: blue;

.button {
  background-color: @primary;
  padding: 8px 16px;

  &:hover {
    background-color: darken(@primary, 10%);
  }
}
```

✅ Easy to learn, similar to CSS
❌ Smaller community than Sass, fewer features

### 2.3 CSS Modules
Regular CSS/SCSS files where class names are **automatically scoped locally** per component at build time (via Webpack/Vite).

```css
/* Button.module.css */
.button {
  background-color: blue;
  color: white;
}
```

```tsx
import styles from './Button.module.css';

const Button = () => <button className={styles.button}>Click</button>;
// Rendered: <button class="Button_button_x3k2a">Click</button>
```

✅ Scoped by default (no class name collisions), works with preprocessors, no runtime cost
❌ Harder to do dynamic styling, class name composition can be verbose

### 2.4 CSS-in-JS (Styled Components, Emotion, Stitches)
CSS is written **inside JavaScript/TypeScript**, styles are generated at runtime or build time.

#### Styled Components

```tsx
import styled from 'styled-components';

const Button = styled.button<{ $primary?: boolean }>`
  background-color: ${props => props.$primary ? 'blue' : 'gray'};
  color: white;
  padding: 8px 16px;

  &:hover {
    opacity: 0.8;
  }
`;

// Usage
<Button $primary>Click me</Button>
```

#### Emotion

```tsx
import { css } from '@emotion/react';

const buttonStyle = css`
  background-color: blue;
  color: white;
  padding: 8px 16px;
`;

const Button = () => <button css={buttonStyle}>Click</button>;
```

✅ Dynamic styling based on props/state, scoped by default, co-located with components, full JS power
❌ Runtime overhead, larger bundle, harder to cache, SSR complexity

### 2.5 Utility-First CSS (Tailwind CSS, UnoCSS)
Pre-defined utility classes composed directly in markup. No custom CSS files needed.

```tsx
const Button = () => (
  <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-700 rounded">
    Click me
  </button>
);
```

✅ Rapid development, consistent design tokens, small production bundle (purged), no naming fatigue
❌ Verbose markup, learning curve, harder to read for complex styles

### 2.6 PostCSS (CSS Post-processor / Transformer)
A tool that transforms CSS with **plugins**. It's not a preprocessor itself but a platform.

```css
/* Using postcss-nesting plugin */
.button {
  background: blue;

  &:hover {
    background: darkblue;
  }
}
```

✅ Modular (pick only plugins you need), can use future CSS syntax today, autoprefixer
❌ Requires configuration, not a single cohesive system

### Summary Table

| Approach | Category | Scoped? | Dynamic? | Build Step? | Runtime Cost |
|---|---|---|---|---|---|
| **Plain CSS** | Native | ❌ | ❌ | ❌ | None |
| **Sass/SCSS/Less** | Preprocessor | ❌ | ❌ | ✅ | None |
| **CSS Modules** | Build-time scoping | ✅ | ❌ | ✅ | None |
| **Styled Components / Emotion** | CSS-in-JS | ✅ | ✅ | Optional | Yes |
| **Tailwind** | Utility-first | N/A | ❌ | ✅ | None |
| **PostCSS** | Post-processor | ❌ | ❌ | ✅ | None |

### Correct Terminology
- **Preprocessor** → Sass, SCSS, Less, Stylus
- **Post-processor / Transformer** → PostCSS
- **CSS-in-JS** → Styled Components, Emotion, Stitches, Linaria
- **CSS Modules** → a build-time scoping technique (works with any of the above)
- **Utility-first framework** → Tailwind, UnoCSS, Tachyons

---

## 3. CSS Approach Used in This Repo

This repo uses **SCSS (preprocessor) + PostCSS (post-processor) + a custom CSS Modules-like scoping pattern**.

### 3.1 SCSS as the preprocessor
All 382 style files are `.scss`. They use SCSS features like nesting with `&`.

### 3.2 PostCSS as the post-processor
After SCSS compiles, PostCSS applies additional transforms via these plugins:
- `postcss-import` — `@import` inlining
- `postcss-mixins` — mixins support
- `postcss-preset-env` — modern CSS features (nesting, custom media queries)
- `postcss-url` — URL handling
- `postcss-inline-svg` — SVG inlining
- `cssnano` — minification

### 3.3 Custom BEM-scoped pattern (via the Amiga framework)
Instead of standard CSS Modules (`.module.css`), the project uses a **framework-provided `block()` mixin** that generates scoped class names:

```scss
// SCSS file
@include block(ROOT, reoperable-articles-header) {
  &__cancel-btn {
    padding: 0;
    cursor: pointer;
  }
}
```

```tsx
// Component file — imports a named ROOT export
import { ROOT } from './reoperable-articles-header.scss';

// Uses BEM-style class names
<button className={`${ROOT}__cancel-btn`}>Cancel</button>
```

The `block()` mixin (from `@amiga-fwk-web`) generates a **unique scoped root class name** and exports it as `ROOT`, which components import. This gives **CSS Modules-like scoping** while following **BEM naming conventions** (`block__element`).

### Summary

| Layer | Tool | Role |
|---|---|---|
| Authoring | **SCSS** | Variables, nesting, `&` selectors |
| Scoping | **Amiga `block()` mixin** | BEM-based, exports scoped class name to JS |
| Post-processing | **PostCSS** | Autoprefixing, modern CSS polyfills, SVG inlining, minification |

No CSS-in-JS (no styled-components/emotion) and no Tailwind — it's a **preprocessor + post-processor + framework-scoped BEM** approach.

---

## 4. Preprocessor vs Post-processor — Difference and Setup

### Preprocessor (e.g. Sass/SCSS, Less)

**What it does:** Takes a **custom language** (`.scss`, `.less`) and compiles it into **plain CSS** *before* the browser sees it.

**Analogy:** TypeScript → JavaScript. You write in an enhanced language, it outputs the standard one.

```
 .scss file  →  [Sass compiler]  →  .css file
```

**What it adds:** Variables, mixins, functions, nesting, loops, partials — things CSS didn't have (or didn't have at the time).

#### Setup from scratch (Webpack):

```bash
# 1. Install
npm install sass sass-loader --save-dev

# 2. Add to webpack rules
```

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      //     ← reads CSS    ← resolves     ← compiles
      //       into DOM       imports/urls    SCSS → CSS
    },
  ],
}
```

### Post-processor (e.g. PostCSS)

**What it does:** Takes **already valid (or near-valid) CSS** and **transforms** it via plugins — adding vendor prefixes, polyfilling future syntax, minifying, etc.

**Analogy:** Like a linter or formatter — it processes the output, not a different language.

```
 .css file  →  [PostCSS + plugins]  →  optimized .css file
```

**What it adds:** Nothing by itself. Each **plugin** adds a specific transform:
- `autoprefixer` → adds `-webkit-`, `-moz-` prefixes
- `postcss-preset-env` → lets you use future CSS today
- `cssnano` → minifies
- `postcss-nesting` → polyfills native CSS nesting

#### Setup from scratch (Webpack):

```bash
# 1. Install
npm install postcss postcss-loader autoprefixer cssnano --save-dev
```

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    },
  ],
}
```

```js
// postcss.config.js
module.exports = {
  plugins: ['autoprefixer', 'cssnano'],
};
```

### Both together (like this repo)

The **pipeline**:

```
.scss → [sass-loader] → .css → [postcss-loader] → optimized .css → [css-loader] → [style-loader] → DOM
         preprocessor            post-processor
```

Webpack config:

```js
{
  test: /\.scss$/,
  use: [
    'style-loader',    // 4. Injects CSS into DOM
    'css-loader',      // 3. Resolves @import, url()
    'postcss-loader',  // 2. Post-process: autoprefixer, minify
    'sass-loader',     // 1. Compile SCSS → CSS
  ],
  // ⚠️ Loaders run BOTTOM → TOP
}
```

### Key Difference Summary

|  | **Preprocessor** (Sass) | **Post-processor** (PostCSS) |
|---|---|---|
| **Input** | Custom language (`.scss`) | Standard CSS |
| **Output** | Plain CSS | Optimized CSS |
| **When** | Before CSS exists | After CSS exists |
| **Purpose** | Author with enhanced syntax | Transform/optimize output |
| **Extensible?** | Fixed feature set | Plugin-based (unlimited) |
| **Examples** | Sass, Less, Stylus | PostCSS, Autoprefixer, cssnano |
| **Webpack loader** | `sass-loader` (runs first) | `postcss-loader` (runs after) |

**TL;DR:** Preprocessor = *"write better CSS"*, Post-processor = *"make CSS better after it's written"*.

---

## 5. Pre- and Post-processor Setup on Vite (vs Webpack)

Vite has **built-in support** for both, so it's dramatically simpler than Webpack — no loaders needed.

### Preprocessor (Sass/SCSS) on Vite

```bash
# Just install the compiler — that's it!
npm install sass --save-dev
```

No config needed. Vite detects `.scss` files automatically. Optional config:

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "src/styles/variables" as *;`,
      },
    },
  },
});
```

### Post-processor (PostCSS) on Vite

Just create the config file — Vite picks it up automatically:

```bash
npm install autoprefixer cssnano --save-dev
```

```js
// postcss.config.js  (project root)
module.exports = {
  plugins: ['autoprefixer', 'cssnano'],
};
```

### Both together on Vite

```bash
npm install sass autoprefixer cssnano --save-dev
```

```js
// postcss.config.js
module.exports = {
  plugins: ['autoprefixer', 'cssnano'],
};
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: { /* optional */ },
    },
  },
});
```

### CSS Modules on Vite

Also built-in. Just name files `*.module.scss`:

```tsx
import styles from './Button.module.scss';
<button className={styles.button}>Click</button>
```

### Side-by-side Comparison

| Task | **Webpack** | **Vite** |
|---|---|---|
| **SCSS** | `sass` + `sass-loader` + `css-loader` + `style-loader` + webpack rules | `sass` (just install) |
| **PostCSS** | `postcss` + `postcss-loader` + webpack rules | `postcss.config.js` (auto-detected) |
| **CSS Modules** | Configure `css-loader` with `modules: true` | Name file `*.module.css/scss` |
| **Config lines** | ~15-20 lines in webpack config | 0-5 lines in vite config |
| **Loader order** | Manual (bottom→top in `use` array) | Automatic |

**TL;DR:** Vite treats CSS as a first-class citizen — install the compiler, optionally add a PostCSS config file, and everything just works. No loaders, no rules, no ordering concerns.
