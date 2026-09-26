# Scope-Based Verification

Choose checks by the changed behavior and the reader's actual opening mode. The checklist below is a retained catalog, not an instruction to run every item on every task.

| Change | Checks to select |
| --- | --- |
| Local text or link | Changed page, affected links/anchors and known new search content if indexed; source/payload sync for Markdown edits. |
| Local styling | Changed page at relevant widths/states; inspect overflow and affected keyboard/focus behavior. |
| Shared assets or navigation | All affected page links and metadata, plus representative HTML/Markdown/home shells at desktop and mobile; exercise affected shared components. |
| New site or architecture | All page routes and each distinct shell in a browser; desktop/mobile, navigation, search, intended opening modes and applicable repository checks. |
| Markdown or localization | Select the relevant Markdown/library/fallback/source or language-routing checks below. |

Run relevant repository checks when defined. A targeted edit does not require adding a server, build system, search, another locale, or a new architecture to satisfy an unrelated checklist item. When file opening is a requirement, verify `file://`; otherwise use the project's actual preview/hosted mode.

## Completion and Failure Boundary

Report the implemented result, concrete checks actually run and their results, then any failed or unverified checks with a reason and practical next step. Syntax/link checks support only those claims, never a browser, responsive or sanitizer claim. Treat newly introduced console errors/warnings and broken relevant paths as failures; identify existing unrelated diagnostics rather than claiming the whole console is clean.

If browser tools, a required dependency or the normal preview are unavailable, use available static/runtime checks, record the missing verification, and stop that validation branch. If a relevant check fails, fix within the authorized scope and rerun it. If blocked by permissions, missing source or an external service, preserve completed work and state the specific blocker; do not retry unchanged conditions indefinitely or claim the blocked behavior passed.

## Full Check Catalog

For each selected check, verify the site in the way a reader will actually open it:

- Open affected HTML pages in a browser through the project's normal preview surface. For a new site, cover every page route and each distinct shell.
- Check desktop and mobile widths.
- Confirm the change introduces no browser console errors or warnings; identify any existing unrelated diagnostics.
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
- When source changes, confirm `.md` and safe inline JSON decode to identical text, including technical examples and trailing newlines. Exercise body-read failure fallback when modifying the loader.
- Confirm search entries point to existing pages/anchors and can find known newly added content; updating `pages` does not regenerate `searchIndex`.
- Close the mobile drawer and confirm hidden controls leave the Tab order, `aria-hidden`/`aria-expanded` agree, and focus returns to the toggle when closing from inside the drawer.
- Confirm relevant mobile interactive targets are at least 44px.
- Inspect sanitized Markdown output containing raw HTML; script/handler/unsafe-URL payloads must not execute. A parser smoke check alone does not prove sanitization.
