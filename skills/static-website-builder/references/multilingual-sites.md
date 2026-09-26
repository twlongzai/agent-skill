# Multilingual Static Sites

Read only when the requested site needs multiple languages or a locale-related change. For other locale sets, adapt detection and routing to those supported locales rather than forcing the template defaults.

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
