# Markdown Pages and Code Highlighting

Read this for Markdown source, rendered Markdown shells, or syntax highlighting. Use an existing project renderer when present rather than replacing its build pipeline.

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
- For `file://` support, embed a safely serialized Markdown string in `<script type="application/json" data-markdown-source data-markdown-encoding="json">`. Most browsers block `fetch()` from a local file page to a neighboring `.md` file.
- For localhost or static hosting, a Markdown shell may use `data-markdown-src="article.md"`. Include inline Markdown too when the same page must work from `file://`.
- Load `../vendor/marked.umd.js`, `../vendor/purify.min.js`, optional local syntax-highlighting plugins such as `../vendor/prismjs/prism-nearloop.min.js`, and then `../site-components.js` on Markdown shells.
- Sanitize rendered Markdown with DOMPurify before inserting it into the page.
- Add section anchors for generated Markdown headings in `site-components.js`. Match the slugified heading text or add explicit HTML headings in the Markdown when stable anchors matter.
- Preserve code fences, commands, API names, frontmatter-like examples, and literal paths exactly.

## Safe Inline Source Contract

Use the `.md` file as the source of truth and regenerate its inline payload after every content change:

```bash
node /path/to/skill/scripts/sync-markdown.cjs /path/to/site/en/markdown.html /path/to/site/en/article.md
node /path/to/skill/scripts/sync-markdown.cjs /path/to/site/en/markdown.html /path/to/site/en/article.md --check
```

The first command changes only the supplied HTML shell; `--check` is read-only and fails on mismatch. Run separately for each locale. Both tools require Node.js and local files; no package installation or server is needed. Missing paths, multiple source mounts, or malformed payloads are failures to fix before claiming Markdown verification passed.

The payload is a JSON string, produced with `JSON.stringify(source).replace(/</g, "\\u003c")`. Replacing literal `<` prevents HTML's raw script parsing from recognizing any closing script tag, regardless of letter case. `JSON.parse()` restores the exact original text, including quotes, backslashes, literal `\u003c`, closing tags, and trailing newlines. Do not hand-rewrite `</script>` as `<\/script>`; that changes code examples. Existing plain-text shells remain supported, but arbitrary supplied source must use safe JSON serialization.

Minimal localized shell (payload represents `# Article Title`, a blank line, and `## Overview`):

```html
<main id="content" class="content">
  <article class="markdown-page" data-markdown-page data-markdown-src="article.md">
    <script type="application/json" data-markdown-source data-markdown-encoding="json">"# Article Title\n\n## Overview\n"</script>
  </article>
  <div data-site-pager></div>
</main>
<script src="../vendor/marked.umd.js"></script>
<script src="../vendor/purify.min.js"></script>
<script src="../vendor/prismjs/prism-nearloop.min.js"></script>
<script src="../site-components.js"></script>
```

For hosted/localhost pages, `data-markdown-src` is fetched first, and fetch, HTTP-status or body-read failures fall back to inline content. For `file://`, only the inline content is used. Validate both opening modes when both are required. Keep external `.md`, inline payload, page section metadata, and the separate `searchIndex` synchronized. DOMPurify sanitizes rendered HTML before insertion; source serialization protects the earlier HTML parsing stage. Keep both protections. External HTTP(S) links receive `noopener noreferrer` with `_blank`.

`node /path/to/skill/scripts/check-template.cjs [/path/to/copied-template]` checks the bundled shared runtime, exact Markdown round trips, fallback behavior, source synchronization, declared section/search links and local vendor assets. Run it only on trusted bundled or copied templates: it executes the template runtime and vendor JavaScript, and Node's `vm` is not a security sandbox. The helper's own checks do not intentionally write files; that is not a guarantee about arbitrary supplied code.

The checker assumes the bundled locale-folder/runtime contract; use the project's checks for other architectures. For basic rendered heading text it calls the runtime's actual ID allocator in a minimal DOM fixture, including duplicate headings and existing shell/heading IDs. Inline formatting, entities and complex raw HTML require browser verification; it reports generated section/search anchors deferred for those pages instead of rejecting them using guessed IDs. The fixture does not prove full rendered DOM equivalence, browser layout or DOMPurify DOM execution.
