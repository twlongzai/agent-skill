#!/usr/bin/env node
// Checks trusted shared-runtime templates without intentionally writing files.
// Runtime/vendor code is executed; node:vm is not a security sandbox.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { encodeMarkdown, syncMarkdown } = require("./sync-markdown.cjs");

const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log("Usage: node check-template.cjs [template-folder]\nUse only trusted bundled/copied templates: this executes their runtime and vendor JavaScript; node:vm is not a security sandbox. The helper's own checks do not intentionally write files. Checks runtime regressions, Markdown synchronization, local links, search targets and vendored parsers in memory. Basic heading IDs use the runtime algorithm with a minimal DOM fixture; formatted/entity headings require browser verification. Browser layout and DOMPurify execution require separate checks.");
  process.exit(0);
}
if (args.length > 1) throw new Error("Supply at most one template folder.");
const base = path.resolve(args[0] || path.join(__dirname, "../assets/static-site-template"));
const runtime = fs.readFileSync(path.join(base, "site-components.js"), "utf8");
const hooks = "globalThis.audit = { siteData, inlineMarkdownSource, markdownSource, renderMarkdownPage, ensureHeadingIds, searchMatches, applySidebarState, normalizeMarkdownLinks };";
assert(runtime.includes("  init();"), "Shared runtime entry point is unavailable.");
const context = {
  window: { matchMedia: () => ({ matches: false }), location: { protocol: "https:", pathname: "/en/page.html" } },
  document: { documentElement: { classList: { toggle() {} } }, body: { dataset: {} }, addEventListener() {} },
  navigator: { language: "en" },
  console: { warn() {} },
};
vm.createContext(context);
vm.runInContext(runtime.replace("  init();", `  ${hooks}`), context);
const audit = context.audit;
let checks = 0;
function passed() { checks += 1; }
function containerWith(source, encoding = "json", src = "article.md") {
  return {
    querySelector: () => ({ textContent: source, getAttribute: () => encoding }),
    getAttribute: () => src,
  };
}

// Exercise the actual allocator, including IDs already in the document and
// explicit IDs on later headings. This fixture is not a browser HTML parser.
function assignHeadingIds(headings, existingIds) {
  const previous = context.document.getElementById;
  context.document.getElementById = (id) => existingIds.has(id) || headings.find((heading) => heading.id === id) || null;
  try {
    audit.ensureHeadingIds({ querySelectorAll: () => headings });
    return headings.map((heading) => heading.id);
  } finally {
    context.document.getElementById = previous;
  }
}

function explicitId(attributes) {
  const match = attributes.match(/(?:^|\s)id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i);
  return match ? (match[1] ?? match[2] ?? match[3]) : "";
}

function markdownAnchors(marked, source, shellIds) {
  const rendered = marked.parse(source);
  const headings = [];
  const existingIds = new Set(shellIds);
  let complete = true;
  for (const match of rendered.matchAll(/<[a-z][\w-]*\b([^>]*)>/gi)) {
    const id = explicitId(match[1]);
    if (id.includes("&")) complete = false;
    else if (id) existingIds.add(id);
  }
  for (const match of rendered.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi)) {
    const id = explicitId(match[2]);
    // textContent for inline markup/entities needs a real HTML DOM. Defer
    // generated anchors for the entire page because its collisions may change.
    if (/[<&]/.test(match[3]) || id.includes("&")) complete = false;
    headings.push({ id, textContent: match[3] });
  }
  // Complex raw HTML can change parsing/sanitization and heading boundaries.
  for (const token of marked.lexer(source)) {
    if (token.type === "html" && !/^\s*<h([1-6])\b[^>]*>[^<&]*<\/h\1>\s*$/i.test(token.raw)) complete = false;
  }
  if (!complete) return { ids: new Set(shellIds), complete: false };
  for (const id of assignHeadingIds(headings, existingIds)) existingIds.add(id);
  return { ids: existingIds, complete: true };
}

async function main() {
  const original = '# 安全 source\n```html\n</script><script>alert("x")</script>\n<\\/script>\n```\n\\u003c literal, $& replacement, quotes " and backslash \\\n\n';
  const encoded = encodeMarkdown(original);
  assert(!encoded.includes("<"), "Payload must not contain HTML script terminators.");
  assert.equal(audit.inlineMarkdownSource(containerWith(encoded)), original);
  passed();
  assert.throws(() => audit.inlineMarkdownSource(containerWith('{"wrong":"type"}')), /string/i);
  passed();
  assert.throws(() => audit.inlineMarkdownSource(containerWith('invalid json')), /JSON/i);
  passed();

  context.fetch = async () => ({ ok: true, text: async () => { throw new Error("body read failed"); } });
  assert.equal(await audit.markdownSource(containerWith(encoded), {}, original), original, "Body-read failure must use the inline source.");
  passed();
  context.fetch = async () => ({ ok: false, status: 404 });
  assert.equal(await audit.markdownSource(containerWith(encoded), {}, original), original);
  passed();
  await assert.rejects(audit.markdownSource(containerWith(""), {}, ""), /HTTP 404/);
  passed();
  context.fetch = async () => { throw new Error("network unavailable"); };
  assert.equal(await audit.markdownSource(containerWith(encoded), {}, original), original);
  passed();
  context.window.location.protocol = "file:";
  context.fetch = async () => { throw new Error("file:// must not fetch"); };
  assert.equal(await audit.markdownSource(containerWith(encoded), {}, original), original);
  passed();
  await assert.rejects(audit.markdownSource(containerWith(""), { markdownFileProtocol: "inline source required" }, ""), /inline source required/);
  passed();

  const controls = [{ tabIndex: 0 }, { tabIndex: 0 }];
  const sidebar = { setAttribute() {}, querySelectorAll: () => controls, contains: () => false };
  const toggle = { setAttribute() {}, focus() {} };
  audit.applySidebarState(sidebar, toggle, "hidden");
  assert(controls.every((control) => control.tabIndex === -1));
  audit.applySidebarState(sidebar, toggle, "visible");
  assert(controls.every((control) => control.tabIndex === 0));
  passed();
  let focusReturned = false;
  sidebar.contains = () => true;
  toggle.focus = () => { focusReturned = true; };
  audit.applySidebarState(sidebar, toggle, "hidden");
  assert(focusReturned, "Closing with focus in the drawer must return focus before hiding it.");
  passed();
  const attributes = { href: "https://example.com/article" };
  audit.normalizeMarkdownLinks({ querySelectorAll: () => [{ getAttribute: (key) => attributes[key], setAttribute: (key, value) => { attributes[key] = value; } }] });
  assert.equal(attributes.rel, "noopener noreferrer");
  assert.equal(attributes.target, "_blank");
  passed();

  const marked = require(path.join(base, "vendor/marked.umd.js"));
  const prism = require(path.join(base, "vendor/prismjs/prism-nearloop.min.js"));
  for (const language of ["markup", "css", "javascript", "bash", "json", "toml", "rust", "yaml", "markdown"]) {
    assert(prism.languages[language], `Missing grammar: ${language}`);
  }
  assert(marked.parse("```rust\nlet x = 1;\n```").includes("language-rust"));
  passed();

  const duplicates = markdownAnchors(marked, "## Overview\n\n## Overview\n", new Set());
  assert(duplicates.complete && duplicates.ids.has("overview") && duplicates.ids.has("overview-2"), "Duplicate section/search anchors must retain runtime suffixes.");
  passed();
  const shellCollision = markdownAnchors(marked, "## Overview\n", new Set(["overview"]));
  assert.equal(explicitId('data-id="overview"'), "", "A data-id attribute is not an existing DOM ID.");
  assert(shellCollision.ids.has("overview-2"), "Existing shell IDs must reserve their anchor.");
  passed();
  const explicitHeading = markdownAnchors(marked, '<h2 id="overview">Custom title</h2>\n\n## Overview\n', new Set());
  assert(explicitHeading.complete && explicitHeading.ids.has("overview-2"), "Explicit Markdown heading IDs must be preserved and reserve their anchor.");
  passed();
  assert.deepEqual(assignHeadingIds([{ id: "", textContent: "Overview" }, { id: "overview", textContent: "Later" }], new Set()), ["overview-2", "overview"], "Later explicit IDs already exist in the rendered document.");
  passed();
  assert.equal(markdownAnchors(marked, "## **Overview** &amp; details\n", new Set()).complete, false, "Formatted/entity headings must be reported as requiring browser verification.");
  passed();

  // Exercise the renderer's error boundary; the real sanitizer DOM is a browser check.
  context.document.createElement = () => ({ appendChild() {} });
  context.window.marked = marked;
  context.window.DOMPurify = { sanitize: (html) => html };
  const invalidContainer = containerWith('invalid json');
  let status;
  invalidContainer.replaceChildren = (node) => { status = node; };
  await audit.renderMarkdownPage(invalidContainer, { markdownLoadError: "source error" });
  assert.equal(status.textContent, "source error");
  assert.equal(status.className, "markdown-status markdown-error");
  passed();

  const anchorsByFile = new Map();
  const deferred = new Set();
  function checkAnchor(result, anchor, label) {
    if (result.ids.has(anchor)) return;
    if (!result.complete) { deferred.add(label); return; }
    assert.fail(`Missing anchor: ${label}`);
  }
  for (const [locale, data] of Object.entries(audit.siteData)) {
    for (const page of data.pages) {
      const file = path.join(base, locale, page.href);
      const html = fs.readFileSync(file, "utf8");
      const ids = new Set([...html.matchAll(/<[a-z][\w-]*\b([^>]*)>/gi)].map((match) => explicitId(match[1])).filter(Boolean));
      let anchors = { ids, complete: true };
      for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        const ref = match[1];
        if (ref.startsWith("#") || /^[a-z]+:/i.test(ref)) continue;
        assert(fs.existsSync(path.resolve(path.dirname(file), ref.split("#")[0])), `Missing local asset: ${file}: ${ref}`);
      }
      if (page.format === "markdown") {
        const mount = html.match(/<article\b[^>]*data-markdown-page[^>]*>/)[0];
        const sourceRef = mount.match(/data-markdown-src="([^"]+)"/)[1];
        const sourcePath = path.resolve(path.dirname(file), sourceRef);
        syncMarkdown(file, sourcePath, true);
        const source = fs.readFileSync(sourcePath, "utf8");
        anchors = markdownAnchors(marked, source, ids);
        if (!anchors.complete) console.warn(`BROWSER REQUIRED: Markdown heading anchors in ${file} contain formatting, entities or complex HTML; generated section/search anchors are deferred.`);
      }
      for (const section of page.sections) checkAnchor(anchors, decodeURIComponent(section.href.slice(1)), `${file}${section.href}`);
      anchorsByFile.set(file, anchors);
      passed();
    }
    for (const entry of data.searchIndex) {
      const [ref, anchor] = entry.href.split("#");
      const file = path.resolve(base, locale, ref);
      assert(anchorsByFile.has(file), `Search result is not a declared page: ${entry.href}`);
      if (anchor) checkAnchor(anchorsByFile.get(file), decodeURIComponent(anchor), `${locale}/${entry.href}`);
      assert(audit.searchMatches(entry.title, data.searchIndex).some((match) => match.href === entry.href), `Search title cannot find its entry: ${entry.href}`);
    }
    passed();
  }
  console.log(`PASS: ${checks} runtime, source synchronization, navigation/search and vendor checks. ${deferred.size} section/search anchors deferred for browser verification. Browser layout, full rendered DOM equivalence and sanitizer DOM execution not tested.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
