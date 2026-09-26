# New Sites and Template Setup

Read this when creating a site or changing its shared structure. These are defaults for a new text-first site, not required migrations for an existing site. Preserve the requested scope and stronger repository conventions. For a local edit, use the entrypoint and inspect only affected files.

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
7. Replace template article content with the real prose. For Markdown shells, update the `.md` source and regenerate its safe JSON payload with `scripts/sync-markdown.cjs`; see [markdown-pages.md](markdown-pages.md).
8. Rename copies of localized `page.html` or `markdown.html` to the filenames listed in that locale's `pages`.
9. Add `language-*` classes to HTML code blocks and language identifiers to Markdown fences so the local syntax highlighter can colorize code.

The bundled template has two locales. For a single-language site, retain only the requested locale data and shells, remove the language switcher, and adapt relative paths and the root homepage. Do not add translations solely because the template includes them.

Changing `pages` updates navigation, file index, reading order and pager; `searchIndex` is maintained separately. When changing titles, sections or prose, update search entries and verify target files/anchors and known new content. Preserve local vendor files and their licenses when copying the template.
