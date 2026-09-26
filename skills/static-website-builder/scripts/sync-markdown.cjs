#!/usr/bin/env node
// Keep a Markdown shell's file:// payload identical to its source file.
const fs = require("node:fs");

function encodeMarkdown(source) {
  // Raw-text HTML script parsing sees literal '<', even for application/json.
  return JSON.stringify(source).replace(/</g, "\\u003c");
}

function syncMarkdown(shellPath, sourcePath, check = false) {
  const html = fs.readFileSync(shellPath, "utf8");
  const source = fs.readFileSync(sourcePath, "utf8");
  const pattern = /<script\b[^>]*\bdata-markdown-source(?:\s|=|>)[\s\S]*?<\/script\s*>/gi;
  const matches = [...html.matchAll(pattern)];
  if (matches.length !== 1) {
    throw new Error("Expected exactly one data-markdown-source script in the shell.");
  }
  const payload = `<script type="application/json" data-markdown-source data-markdown-encoding="json">${encodeMarkdown(source)}</script>`;
  const updated = html.replace(pattern, () => payload);
  if (check && updated !== html) {
    throw new Error("Inline Markdown differs from its source or needs safe JSON encoding. Run without --check to sync.");
  }
  if (!check && updated !== html) fs.writeFileSync(shellPath, updated);
  return updated === html ? "already synchronized" : "synchronized";
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("Usage: node sync-markdown.cjs <shell.html> <source.md> [--check]\nOnly the supplied shell is changed. --check is read-only and exits nonzero on mismatch.");
  } else {
    try {
      const paths = args.filter((arg) => arg !== "--check");
      if (paths.length !== 2 || args.some((arg) => arg.startsWith("--") && arg !== "--check")) {
        throw new Error("Usage: node sync-markdown.cjs <shell.html> <source.md> [--check]");
      }
      console.log(syncMarkdown(paths[0], paths[1], args.includes("--check")));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}

module.exports = { encodeMarkdown, syncMarkdown };
