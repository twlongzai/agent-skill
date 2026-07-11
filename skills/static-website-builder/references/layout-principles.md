# Static Website Layout Principles

Use this reference when designing, reviewing, or refactoring a text-first static information site.

## Site Architecture

- Make `index.html` the canonical entrance.
- For multilingual sites, make root `index.html` the canonical language entrance and put localized content homepages under locale folders such as `en/index.html` and `zh-TW/index.html`.
- Keep site order explicit in one shared data structure.
- Keep page metadata in one shared data structure: id, href, label, title, description, and section anchors.
- For multilingual sites, key page metadata, framework strings, support files, and search indexes by locale while keeping page ids aligned across locales.
- Render shared UI from shared components: sidebar, top bar, footer, homepage file index, reading order, and previous/next pager.
- Keep the homepage file index reader-facing: show site pages and Markdown support files only, not shared implementation files.
- Keep whole-site search in an inline JavaScript index when the site must work from `file://`.
- Keep locale-specific search indexes inline when the site must work from `file://`; do not fetch external JSON just to switch languages.
- Keep content pages free of duplicated navigation markup.
- Keep localized content in separate files. Do not mix English and Traditional Chinese article content in the same HTML body unless the page itself is a language chooser.
- Keep page content as durable HTML: headings, paragraphs, lists, tables, code blocks, figures, and notes.
- When content is authored in Markdown, keep the reader-facing page as an HTML shell that renders the Markdown inside the shared layout.
- For `file://` support, put the Markdown source inline in the HTML shell with `data-markdown-source`; use `data-markdown-src` only when the site is opened through localhost or static hosting, or when an inline fallback is also present.
- Load Markdown parser and sanitizer files locally from `vendor/`, not from runtime CDNs.
- Load syntax-highlighting plugins locally from `vendor/`, not from runtime CDNs. Use language-labeled Markdown fences or `language-*` code classes so keywords, variables, strings, comments, and punctuation can be colorized by the shared theme.
- Prefer relative links so the site can work from `file://`, localhost, or static hosting.

## Navigation Model

Use a two-level navigation model:

1. Page navigation: anchors for the current page's major sections.
2. Site navigation: pages in reading order.

Expected behavior:

- Desktop: fixed left sidebar plus fixed top bar.
- Mobile: hidden sidebar drawer opened from a top-bar menu button.
- The top bar stays fixed to the viewport top while the page scrolls, so the menu button and current page title remain visible. Offset page content and anchor scroll padding by the top-bar height so headings are not covered.
- Sidebar order: current-page section links first, then the full site page list, then the language switcher for multilingual sites.
- Current-page sections and site pages are separate accordion panels with independent scroll bodies.
- Sidebar panel headings stay visible as sticky controls while their own panel bodies scroll.
- Collapsing a sidebar panel removes that panel body's scroll region from layout. The collapsed panel should be heading-only, and the next panel should move up without a retained blank section.
- Whole-site search is client-side and powered by inline `searchIndex` data in `site-components.js`.
- All pages: previous/next pager at the bottom.
- Content pages: direct return link to `index.html`.
- Homepage: file index of `Page` and `Markdown` entries plus reading order.
- Markdown-rendered pages appear in the normal page navigation with `.html` links. Raw `.md` support files appear in the homepage file index only when they should be exposed as source files.
- Multilingual pages: language switcher linking to the corresponding page id in the other locale, falling back to that locale's homepage if missing. In the sidebar, place it below the full site page list.

## Content-First Layout

For technical docs, tutorials, essays, and fiction, optimize for sustained reading:

- Use a content width around 760-960px for prose-heavy pages.
- Use generous line height, usually 1.55-1.75.
- Keep paragraphs readable; avoid full-width prose on wide monitors.
- Set localized page language explicitly: `<html lang="en">` for English and `<html lang="zh-Hant">` for Taiwan Traditional Chinese.
- Use stable type sizes with breakpoint changes instead of viewport-driven scaling.
- Keep headings large enough to create hierarchy but not so large that they feel like marketing copy.
- Use tables and code blocks with horizontal overflow protection.
- Prefer inline code backgrounds that are subtle and readable in both light and dark mode.
- Keep fenced-code color themes centralized in `site.css`, and let the highlighter add token spans after static HTML or Markdown has rendered.

## Visual System

Use a restrained design system:

- Background: neutral page background.
- Sidebar: slightly tinted panel distinct from content.
- Text: high-contrast foreground plus muted secondary text.
- Accent: one meaningful accent color for active nav, metadata, and key links.
- Radius: small and consistent, usually 6-8px.
- Borders: use hairline borders instead of heavy shadows for documentation sites.
- Cards: use for repeated file/index entries, not for every section.
- Motion: keep transitions short and purposeful; disable them under `prefers-reduced-motion`.

Avoid:

- Decorative gradient blobs, bokeh, or unrelated background art.
- Large marketing hero sections when the site is a reference or tutorial.
- One-note palettes dominated by a single saturated hue.
- Fake stats, logos, testimonials, or decorative icon rows.
- SVG illustrations that do not add information.

## Component Responsibilities

### `site.css`

Owns:

- design tokens,
- base typography,
- sidebar/topbar layout,
- content width,
- tables and code blocks,
- syntax-token color variables and `.token.*` theme selectors,
- cards and file index,
- previous/next pager,
- responsive rules,
- dark mode,
- reduced motion.

### `site-init.js`

Owns only initial state that must happen before paint, such as adding `sidebar-visible` or `sidebar-hidden` to `<html>`.

Keep it tiny. Do not put component rendering here.

### `site-components.js`

Owns:

- locale-keyed page lists,
- localized framework strings,
- Markdown support file lists,
- sidebar rendering,
- top bar rendering,
- footer rendering,
- homepage file index for pages and Markdown support files,
- inline whole-site search index and results per locale,
- reading order,
- previous/next pager,
- language switcher,
- sidebar toggle behavior,
- browser-side Markdown rendering when the site uses Markdown-authored pages.
- browser-side syntax highlighting after static HTML renders and after Markdown content is inserted.

Search index entries should include `title`, `section`, `href`, and searchable `text`. Do not depend on `fetch("search-index.json")` when direct local file opening is a requirement. For multilingual sites, keep one search index per locale.

Keep the data structure easy to edit. When adding a new page, one update to `pages` should update all shared navigation.

### `vendor/`

Owns local third-party browser files required at runtime:

- `marked.umd.js` for parsing Markdown.
- `purify.min.js` for sanitizing rendered Markdown before insertion.
- `prismjs/prism-nearloop.min.js` or an equivalent local syntax-highlighting plugin for colorizing code blocks.
- third-party licenses for the vendored parser, sanitizer, and highlighter.

Do not list these files in the homepage file index.

## Page Shell Contract

Each localized HTML page should use this shape:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page title</title>
  <script src="../site-init.js"></script>
  <link rel="stylesheet" href="../site.css">
</head>
<body data-page="page-id" data-locale="en">
  <a class="skip-link" href="#content">Skip to content</a>
  <div data-site-sidebar></div>

  <div class="page-wrapper">
    <div data-site-topbar></div>

    <main id="content" class="content">
      <!-- page content -->
      <div data-site-pager></div>
    </main>

    <div data-site-footer></div>
  </div>
  <script src="../vendor/prismjs/prism-nearloop.min.js"></script>
  <script src="../site-components.js"></script>
</body>
</html>
```

Use `lang="zh-Hant"` and `data-locale="zh-TW"` for Taiwan Traditional Chinese pages.

Markdown-rendered pages use the same shell and add the parser, sanitizer, and a Markdown mount before `site-components.js`:

```html
<main id="content" class="content">
  <article class="markdown-page" data-markdown-page data-markdown-src="article.md">
    <script type="text/markdown" data-markdown-source>
# Page title

## Section

Markdown content goes here.
    </script>
  </article>
  <div data-site-pager></div>
</main>
<script src="../vendor/marked.umd.js"></script>
<script src="../vendor/purify.min.js"></script>
<script src="../vendor/prismjs/prism-nearloop.min.js"></script>
<script src="../site-components.js"></script>
```

## Accessibility

- Add a skip link.
- Use semantic landmarks: `nav`, `main`, `footer`, headings in order.
- Keep the sidebar toggle as a real `button`.
- Keep `aria-current="page"` on the active page link.
- Update `aria-expanded` on the sidebar toggle and `aria-hidden` on the sidebar.
- Ensure keyboard focus is visible.
- Avoid hiding focusable sidebar links from tab order when the mobile drawer is closed.

## Verification

Use browser verification, not just static reading:

- Open every page.
- Check desktop, tablet if relevant, and mobile.
- Toggle the sidebar.
- Scroll long pages on desktop and mobile and confirm the top bar remains fixed with the menu button and page title visible.
- Collapse and expand both sidebar accordion panels.
- Confirm a collapsed current-page section panel leaves only its heading and lets the site-page panel move up.
- Confirm each sidebar panel body scrolls independently when it contains many links.
- Confirm sticky sidebar panel headings remain visible while their panel bodies scroll.
- Search for known content and verify results without running a local server.
- Open Markdown-rendered pages and confirm Markdown headings, lists, links, tables, and fenced code blocks render in the shared layout.
- Confirm syntax highlighting loads from local vendor assets and colorizes keywords, variables, strings, comments, numbers, and punctuation in HTML code blocks and Markdown fences.
- Confirm Markdown-rendered pages that need `file://` support do not depend only on fetching a neighboring `.md` file.
- Inspect the rendered Markdown output after sanitization when the source includes raw HTML.
- Switch languages and confirm both shared UI text and article content change.
- Confirm the language switcher appears below the site pages block.
- Follow previous/next links.
- Follow the homepage file links.
- Inspect console errors and warnings.
- Check long filenames, tables, code blocks, and headings for overflow.
- Confirm the homepage file index omits shared component files such as `site.css`, `site-init.js`, `site-components.js`, and `vendor/` files.
- Confirm the site works from local file paths unless it intentionally depends on a server.
