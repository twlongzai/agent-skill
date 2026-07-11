# Markdown 頁面

這個頁面會在共享靜態網站 shell 裡渲染 Markdown。當 prose 用 Markdown 比手寫 HTML 更容易維護時，可以使用這個頁面型態。

## Markdown 概覽

- 在 `site-components.js` 維護頁面 metadata。
- 讀者看到的連結仍使用 `markdown.html`。
- 只有在讀者或編輯者需要原始內容時，才把 raw Markdown file 列出來。

> Markdown output 會先經過 sanitizer，再插入頁面。

## 程式碼與表格

```bash
python -m http.server 8000
```

| Source | 讀者頁面 |
| --- | --- |
| `article.md` | `markdown.html` |
| inline fallback | `file://` preview |
