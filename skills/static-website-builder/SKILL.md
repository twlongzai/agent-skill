---
name: static-website-builder
description: "Build or improve text-first static sites with HTML, CSS, JavaScript, and optional Markdown. Use for multilingual docs, tutorials, knowledge bases, serialized writing, and prose-first sites."
---

# Static Website Builder

## Purpose

Use this skill when the site needs to make information easy to read, scan, and move through: technical docs, tutorials, manuals, essays, serialized fiction, course notes, changelogs, or project knowledge bases.

The default stack is plain HTML, CSS, JavaScript, optional local Markdown rendering, and local syntax highlighting for code-heavy pages. Do not introduce React, build tooling, Tailwind, or external CDNs unless the existing project already uses them or the user explicitly asks for them. Prefer a stable reading structure over marketing-page composition.

## Working Order

1. Read the source material, target folder, existing pages, and any local design system before editing.
2. Define the site map. Start with `index.html`, then put the remaining pages in the requested reading order.
   - For multilingual sites, make root `index.html` the locale detector/chooser and put content pages under locale folders such as `en/` and `zh-TW/`.
   - Keep the same page ids and reading order across locales unless the user explicitly asks for locale-specific structure.
3. Before substantial edits, state the design direction briefly:

```markdown
Design Decisions:
- Palette:
- Typography:
- Layout:
- Navigation:
- Shared components:
- Verification:
```

4. Build the shared site assets before the page content:
   - `site.css` for layout, typography, responsive rules, dark mode, component states, code blocks, fixed top-bar behavior, and syntax-token color themes.
   - `site-init.js` for pre-render layout state, such as sidebar visibility, and `window.Prism.manual = true` when PrismJS is used.
   - `site-components.js` for shared sidebar, top bar, footer, homepage index, site search, previous/next navigation, optional Markdown rendering, and syntax-highlighting hooks.
   - `vendor/marked.umd.js` and `vendor/purify.min.js` when any page renders Markdown in the browser.
   - `vendor/prismjs/prism-nearloop.min.js` or an equivalent local syntax-highlighting plugin when pages contain code blocks that should colorize keywords, variables, strings, numbers, comments, or punctuation.
   - For multilingual sites, keep all shared UI strings, page metadata, support-file labels, and search indexes grouped by locale in `site-components.js`.
   - In the sidebar, render the current page's section links before the full site page list.
   - Split the current-page sections and full site page list into two independently scrolling accordion panels.
   - For multilingual sites, render the language switcher after the full site page list, visually below the `SITE PAGES` sidebar panel.
   - Keep the top bar fixed to the viewport top while the page scrolls. The menu toggle and current page title must remain visible on desktop and mobile. Offset the content and anchor scroll padding by the top-bar height so headings are not hidden under the fixed bar.
   - Keep each sidebar panel heading sticky while its panel body scrolls.
   - When a sidebar accordion panel is collapsed, collapse the panel body and the scroll region it occupied. The panel should shrink to its heading only, and the following panel should move up without leaving a blank reserved area.
   - In the homepage file index, render only `Page` entries and `Markdown` support files.
   - Keep the whole-site search index inline in `site-components.js` so search works from `file://` without `fetch()`, servers, CDNs, or build tooling.
5. Keep content pages lean. They should contain metadata, shared component mounts, and the page's article content only.
6. Verify the result in a browser at desktop and mobile widths. Check the console, navigation links, sidebar toggle, previous/next flow, search, and text overflow.

## Code Highlighting

Support syntax highlighting as a shared site capability, not as per-page inline styling.

- Prefer a local syntax-highlighting plugin such as PrismJS or Highlight.js when code blocks are common. Vendor the runtime under `vendor/` and load it from relative paths; do not depend on runtime CDNs.
- If using the reusable template, load `vendor/prismjs/prism-nearloop.min.js` before `site-components.js`. The bundled grammars cover markup, CSS, JavaScript, Bash, JSON, TOML, Rust, YAML, and Markdown.
- Keep the color theme in `site.css` with CSS custom properties and `.token.*` selectors, so keywords, variables, strings, comments, numbers, punctuation, and function names are colorized consistently in light and dark mode.
- Mark HTML code blocks with language classes, for example `<pre><code class="language-rust">...</code></pre>`.
- Mark Markdown fences with language identifiers, for example ```` ```rust ```` or ```` ```toml ````. Avoid unlabeled fences for commands, config, JSON envelopes, or source code.
- Configure PrismJS in manual mode before the plugin loads, then call `Prism.highlightAllUnder(...)` from `site-components.js` after shared components render and again after Markdown content is inserted.
- Let unknown or plain-text blocks fall back safely. Use `language-text` for terminal output, prose examples, URLs, or data that should keep monospace formatting without token colors.
- Preserve code text exactly. Do not rewrite code merely to improve highlighting.

## Markdown Pages

Use Markdown for source prose when it improves editing speed or preserves supplied `.md` material. A reader-facing Markdown page is still an HTML shell that mounts the shared components and renders Markdown into the article area.

- Add rendered Markdown pages to the locale's `pages` array with a normal `.html` `href` and `format: "markdown"`.
- Keep raw `.md` files in `supportFiles` only when they should appear as downloadable or inspectable source files on the homepage. Do not treat a raw `.md` file opened directly by the browser as a rendered page.
- For `file://` support, embed the Markdown source in the HTML shell with `<script type="text/markdown" data-markdown-source>`. Most browsers block `fetch()` from a local file page to a neighboring `.md` file.
- For localhost or static hosting, a Markdown shell may use `data-markdown-src="article.md"`. Include inline Markdown too when the same page must work from `file://`.
- Load `../vendor/marked.umd.js`, `../vendor/purify.min.js`, optional local syntax-highlighting plugins such as `../vendor/prismjs/prism-nearloop.min.js`, and then `../site-components.js` on Markdown shells.
- Sanitize rendered Markdown with DOMPurify before inserting it into the page.
- Add section anchors for generated Markdown headings in `site-components.js`. Match the slugified heading text or add explicit HTML headings in the Markdown when stable anchors matter.
- Preserve code fences, commands, API names, frontmatter-like examples, and literal paths exactly.

Minimal localized Markdown shell:

```html
<main id="content" class="content">
  <article class="markdown-page" data-markdown-page data-markdown-src="article.md">
    <script type="text/markdown" data-markdown-source>
# Article Title

## Overview

Write the page in Markdown. Escape a literal closing script tag as `<\/script>`.
    </script>
  </article>
  <div data-site-pager></div>
</main>
<script src="../vendor/marked.umd.js"></script>
<script src="../vendor/purify.min.js"></script>
<script src="../vendor/prismjs/prism-nearloop.min.js"></script>
<script src="../site-components.js"></script>
```

## Multilingual Sites

When a site needs multiple languages, support `en` and `zh-TW` by default unless the user asks for a different set.

- Use different files for different locale content. Prefer `en/index.html`, `en/page-name.html`, `zh-TW/index.html`, and `zh-TW/page-name.html` rather than putting two languages in one content file.
- Keep root `index.html` as a tiny language detector and manual chooser. It should inspect `navigator.languages`, `navigator.language`, and, when available, `Intl.DateTimeFormat().resolvedOptions().locale`.
- If any detected browser or local system locale starts with `zh`, open `zh-TW/index.html`; otherwise open `en/index.html`.
- Site framework text must be localized too: sidebar labels, search labels and empty states, top-bar button labels, footer text, file-kind labels, pager labels, language switcher labels, and accessibility labels.
- Document content text must be localized in the locale-specific HTML or Markdown files. Preserve code blocks, commands, API names, paths, and contracts exactly unless they are prose comments that need translation.
- Keep locale-specific page metadata, section anchors, support files, and search indexes in one shared data structure keyed by locale. Avoid `fetch()` so the site still works from `file://`.
- Add a language switcher that links to the corresponding page id in the other locale. If a page is missing in a locale, link to that locale's homepage.
- In the sidebar, place the language switcher below the full site page list. Do not put `LANGUAGE` above search, above the current-page sections, or above `SITE PAGES`.
- Set each localized HTML shell explicitly: `<html lang="en">` for English, `<html lang="zh-Hant">` for Taiwan Traditional Chinese, and `body data-locale="en"` or `body data-locale="zh-TW"`.
- Keep locale links relative, for example `../zh-TW/references.html` from `en/references.html`, so the site works locally and on static hosting.

## Recommended Folder Shape

For a plain static site, use this structure unless the repo already has a stronger convention:

```text
site-folder/
|-- index.html
|-- en/
|   |-- index.html
|   |-- markdown.html
|   |-- page-one.html
|   |-- article.md
|   `-- page-two.html
|-- zh-TW/
|   |-- index.html
|   |-- markdown.html
|   |-- page-one.html
|   |-- article.md
|   `-- page-two.html
|-- vendor/
|   |-- marked.umd.js
|   |-- purify.min.js
|   `-- prismjs/
|       |-- LICENSE
|       `-- prism-nearloop.min.js
|-- site.css
|-- site-init.js
`-- site-components.js
```

Optional content files may stay in the relevant locale folder. By default, each localized homepage lists only site pages and Markdown support files for that locale. Do not list shared component files such as `site.css`, `site-init.js`, `site-components.js`, or vendored libraries in the homepage file index.

## Reusable Template

Use `assets/static-site-template/` when starting from scratch or when the existing site has no reusable structure:

- `index.html`: root locale detector and manual language chooser.
- `en/index.html` and `zh-TW/index.html`: localized homepage shells with file index and reading order mounts.
- `en/page.html` and `zh-TW/page.html`: generic localized content-page shells.
- `en/markdown.html` and `zh-TW/markdown.html`: localized Markdown-rendered page shells.
- `site.css`: text-first documentation layout with left sidebar, fixed top bar, responsive drawer, cards, tables, code blocks, pager, dark mode, and reduced-motion handling.
- `site-init.js`: applies initial sidebar state before CSS paints.
- `site-components.js`: locale-keyed shared components, framework strings, page order, support files, inline search indexes, Markdown rendering helpers, and syntax-highlighting hooks.
- `vendor/marked.umd.js` and `vendor/purify.min.js`: local Markdown parser and sanitizer for browser-rendered Markdown pages.
- `vendor/prismjs/prism-nearloop.min.js`: local PrismJS bundle for markup, CSS, JavaScript, Bash, JSON, TOML, Rust, YAML, and Markdown code highlighting.

After copying the template files into the target folder, customize them in this order:

1. Update each locale in `siteData` in `site-components.js` with framework strings, page ids, labels, titles, descriptions, page format, section anchors, support files, and search entries.
2. Keep localized `pages` arrays aligned by page id so language switching, sidebar state, search, and previous/next navigation can map between locales.
3. For rendered Markdown pages, set `format: "markdown"` and use an `.html` shell as the page `href`. Keep raw `.md` files as optional source files, not as the primary reader-facing page link.
4. Update `supportFiles` with optional localized Markdown files that should appear on each locale homepage. Do not add shared component files, generated assets, vendored libraries, or implementation-only files to the homepage file index.
5. Update each locale's `searchIndex` with page titles, section labels, target hrefs, and searchable prose. Keep it inline; do not load an external JSON file when the site must work from `file://`.
6. Set `body data-page="..."` and `body data-locale="..."` in each localized HTML page.
7. Replace template article content or inline Markdown with the real localized prose.
8. Rename copies of localized `page.html` or `markdown.html` to the filenames listed in that locale's `pages`.
9. Add `language-*` classes to HTML code blocks and language identifiers to Markdown fences so the local syntax highlighter can colorize code.

## Layout Principles

Use the fuller checklist in `references/layout-principles.md` when designing or reviewing a site. These defaults should guide the first pass:

- Treat `index.html` as the front door. It should show site pages, Markdown support files, and reading order.
- For multilingual sites, treat root `index.html` as the language front door and each locale's `index.html` as that locale's content homepage.
- Keep navigation persistent: left sidebar on desktop, drawer sidebar on mobile.
- Keep the top bar fixed at the viewport top during page scroll. The sidebar menu toggle and page title should always remain visible, and the content should start below the fixed bar.
- Use page-local section links in the sidebar, not separate ad hoc TOC blocks inside every page.
- Sidebar order is current-page sections first, then all site pages, then the language switcher for multilingual sites.
- Sidebar section and page-list panels are independent scroll regions with accordion collapse controls and sticky headings.
- Collapsed sidebar panels retain only their heading row. Do not leave an empty panel body, fixed-height scroll area, or reserved gap between sidebar panels.
- Provide whole-site client-side search from an inline JS index, not external fetch-based search.
- Render Markdown pages through an HTML shell with local parser and sanitizer files, not through a raw `.md` browser tab.
- Highlight code blocks through shared local assets and Markdown fence language labels, not page-specific inline spans.
- Provide previous/next navigation based on the site map. Content pages must also include a link back to `index.html`.
- Provide language-switcher links based on matching page ids across locales, positioned below the `SITE PAGES` sidebar block.
- Put repeated UI in shared components. Do not duplicate sidebar, top bar, footer, file index, or pager markup across pages.
- Keep pages text-first. Graphics should clarify structure or support comprehension.
- Use stable dimensions and breakpoints. Avoid viewport-driven font scaling except for tightly bounded cases that have been verified.
- Use CSS custom properties for design tokens. Prefer the site's existing brand or accent color.
- Support dark mode and `prefers-reduced-motion`.

## Content Rules

- Preserve supplied technical facts, names, paths, commands, API contracts, code blocks, and code fence language labels.
- Do not invent metrics, diagrams, screenshots, customer logos, quotes, or claims.
- For tutorials and docs, make navigation obvious before adding visual detail.
- For serialized fiction or essays, favor chapter/part navigation, reading progress, and comfortable measure over dashboard-like density.
- Use placeholders only when real assets are missing. Label them plainly, such as `[image: architecture diagram]`.

## Built-In Design Rules

These rules are duplicated here so this skill can stand on its own without activating the `web-design-engineer` skill:

- Gather local design context first. Read existing HTML, CSS, screenshots, and adjacent pages before inventing new styling.
- Match the local visual vocabulary: color ratio, type scale, spacing, border radius, hover/focus states, and density.
- Prefer CSS Grid and Flexbox for layout.
- Use `text-wrap: pretty` for headings and prose where supported.
- Do not use `scrollIntoView`; use anchor links or `window.scrollTo` only when necessary.
- Avoid AI-style visual clichés: purple-pink-blue gradients, meaningless icon spam, decorative blobs, fake logos, fabricated stats, and oversized marketing heroes for documentation.
- Do not use emoji as icons unless the site already uses emoji as part of its real voice.
- Keep body text at least 16px. Keep touch targets at least 44px on mobile.
- Add hover, focus-visible, active, and disabled states where those states can occur.
- Use generated or sourced images only when the user asks for visuals or when an image materially helps the reader understand the content.

## Verification Checklist

Before claiming completion, verify the site in the way a reader will actually open it:

- Open every HTML page in a browser, preferably through the project's normal preview surface.
- Check desktop and mobile widths.
- Confirm the browser console has no errors or warnings.
- Confirm `index.html` links to all site pages and intended Markdown support files, with shared component files omitted from the homepage file index.
- For multilingual sites, confirm root `index.html` routes `zh*` locales to `zh-TW/index.html` and all other locales to `en/index.html`.
- Confirm each locale has separate content files and that localized pages set the correct `lang` and `data-locale` attributes.
- Confirm framework text and document content both change when switching languages.
- Confirm language-switcher links map to the matching page id in the other locale.
- Confirm the `LANGUAGE` block appears below the `SITE PAGES` sidebar block.
- Confirm sidebar current-page state, page section links, and sidebar hide/show behavior.
- Scroll long pages on desktop and mobile and confirm the top bar stays fixed, with the menu toggle and page title visible.
- Confirm sidebar section and page-list panels scroll independently, collapse/expand by accordion buttons, and keep headings visible.
- Collapse the current-page section panel and confirm the site-page panel moves up immediately, with no empty section block left behind.
- Confirm whole-site search returns results from the inline index when opened from `file://`.
- Confirm rendered Markdown pages load local `vendor/marked.umd.js` and `vendor/purify.min.js`, render headings, lists, links, tables, and code fences, and show a clear error if a Markdown source cannot be loaded.
- Confirm syntax-highlighted pages load local highlighting assets such as `vendor/prismjs/prism-nearloop.min.js`, code blocks use `language-*` classes or Markdown fence language labels, and keywords, variables, strings, comments, numbers, and punctuation are visibly colorized.
- Confirm Markdown pages that must work from `file://` include inline `data-markdown-source` content rather than depending only on `fetch()` for a neighboring `.md` file.
- Confirm previous/next order exactly matches the requested site map.
- Confirm each content page can return to `index.html`.
- Confirm text, code blocks, tables, and buttons do not overflow at mobile or desktop widths.
- Run repository checks when the repo defines them.
