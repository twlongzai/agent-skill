# Markdown Page

This page renders Markdown inside the shared static-site shell. Use it when prose is easier to maintain in Markdown than hand-authored HTML.

## Markdown Overview

- Keep the page metadata in `site-components.js`.
- Keep the reader-facing link as `markdown.html`.
- Keep the raw Markdown file only when readers or editors need source access.

> Markdown output is sanitized before it is inserted into the page.

## Code and Tables

```bash
python -m http.server 8000
```

| Source | Reader-facing page |
| --- | --- |
| `article.md` | `markdown.html` |
| inline fallback | `file://` preview |
