(function () {
  const root = document.documentElement;
  const desktopQuery = window.matchMedia("(min-width: 901px)");
  const storageKey = "static-site-sidebar";
  const defaultLocale = "en";
  const locales = ["en", "zh-TW"];

  const siteData = {
    "en": {
      label: "English",
      strings: {
        brandKicker: "Static site",
        brandTitle: "Information",
        sidebarLabel: "Site navigation",
        searchLabel: "Search this site",
        searchPlaceholder: "Search content",
        searchEmpty: "No results",
        pageSections: "On this page",
        sitePages: "Site pages",
        languageLabel: "Language",
        toggleAriaLabel: "Hide or show menu",
        toggleHiddenText: "Toggle menu",
        pagerLabel: "Previous and next pages",
        previous: "Previous",
        next: "Next",
        homeCurrent: "Currently on home",
        backHome: "Back to index.html",
        pageKind: "Page",
        markdownKind: "Markdown",
        markdownLoading: "Loading Markdown...",
        markdownLoadError: "Markdown could not be loaded. Check the source path or inline fallback.",
        markdownMissingLibraries: "Markdown renderer unavailable. Confirm vendor/marked.umd.js and vendor/purify.min.js are loaded before site-components.js.",
        markdownFileProtocol: "External Markdown cannot be fetched from file://. Add inline data-markdown-source content or preview through a local server.",
        footerText: "This static site uses shared layout components. Update site-components.js when page order or localized strings change.",
      },
      pages: [
        {
          id: "index",
          href: "index.html",
          label: "Home",
          title: "Static Site Home",
          description: "Homepage, file index, and reading order.",
          sections: [
            { href: "#site-files", label: "Site Files" },
            { href: "#reading-order", label: "Reading Order" },
          ],
        },
        {
          id: "example",
          href: "page.html",
          label: "Example Page",
          title: "Example Page",
          description: "Template article page.",
          sections: [
            { href: "#overview", label: "Overview" },
            { href: "#details", label: "Details" },
          ],
        },
        {
          id: "markdown",
          href: "markdown.html",
          label: "Markdown Page",
          title: "Markdown Page",
          description: "Template article page rendered from Markdown source.",
          format: "markdown",
          sections: [
            { href: "#markdown-overview", label: "Markdown Overview" },
            { href: "#code-and-tables", label: "Code and Tables" },
          ],
        },
      ],
      supportFiles: [
        {
          href: "article.md",
          label: "article.md",
          kind: "Markdown",
          description: "Raw Markdown source for the rendered Markdown page.",
        },
      ],
      searchIndex: [
        {
          title: "Static Site Home",
          section: "Site Files",
          href: "index.html#site-files",
          text: "Homepage entry point, page links, Markdown support files, and site file index.",
        },
        {
          title: "Static Site Home",
          section: "Reading Order",
          href: "index.html#reading-order",
          text: "Reading order for chapters, tutorial steps, documentation pages, and previous next flow.",
        },
        {
          title: "Example Page",
          section: "Overview",
          href: "page.html#overview",
          text: "Template article page overview for a text-first static information site.",
        },
        {
          title: "Example Page",
          section: "Details",
          href: "page.html#details",
          text: "Template detail section for durable prose, tables, code blocks, and notes.",
        },
        {
          title: "Markdown Page",
          section: "Markdown Overview",
          href: "markdown.html#markdown-overview",
          text: "Template page rendered from inline Markdown source with local marked parser and DOMPurify sanitizer.",
        },
        {
          title: "Markdown Page",
          section: "Code and Tables",
          href: "markdown.html#code-and-tables",
          text: "Markdown fenced code blocks, tables, links, lists, and technical prose.",
        },
      ],
    },
    "zh-TW": {
      label: "台灣繁體中文",
      strings: {
        brandKicker: "靜態網站",
        brandTitle: "資訊",
        sidebarLabel: "網站導覽",
        searchLabel: "搜尋網站",
        searchPlaceholder: "搜尋內容",
        searchEmpty: "找不到結果",
        pageSections: "本頁章節",
        sitePages: "站內頁面",
        languageLabel: "語系",
        toggleAriaLabel: "隱藏或顯示選單",
        toggleHiddenText: "切換選單",
        pagerLabel: "上一頁與下一頁",
        previous: "上一頁",
        next: "下一頁",
        homeCurrent: "目前在首頁",
        backHome: "回到 index.html",
        pageKind: "頁面",
        markdownKind: "Markdown",
        markdownLoading: "正在載入 Markdown...",
        markdownLoadError: "無法載入 Markdown。請檢查來源路徑或 inline fallback。",
        markdownMissingLibraries: "Markdown renderer 無法使用。請確認 vendor/marked.umd.js 與 vendor/purify.min.js 已在 site-components.js 前載入。",
        markdownFileProtocol: "無法從 file:// fetch 外部 Markdown。請加入 inline data-markdown-source 內容，或透過本機 server 預覽。",
        footerText: "這個靜態網站使用共享版面元件。頁面順序或多語系文字變更時，請更新 site-components.js。",
      },
      pages: [
        {
          id: "index",
          href: "index.html",
          label: "首頁",
          title: "靜態網站首頁",
          description: "首頁、檔案索引與閱讀順序。",
          sections: [
            { href: "#site-files", label: "網站檔案" },
            { href: "#reading-order", label: "閱讀順序" },
          ],
        },
        {
          id: "example",
          href: "page.html",
          label: "範例頁面",
          title: "範例頁面",
          description: "範本文章頁。",
          sections: [
            { href: "#overview", label: "概覽" },
            { href: "#details", label: "細節" },
          ],
        },
        {
          id: "markdown",
          href: "markdown.html",
          label: "Markdown 頁面",
          title: "Markdown 頁面",
          description: "從 Markdown source 渲染的範本文章頁。",
          format: "markdown",
          sections: [
            { href: "#markdown-概覽", label: "Markdown 概覽" },
            { href: "#程式碼與表格", label: "程式碼與表格" },
          ],
        },
      ],
      supportFiles: [
        {
          href: "article.md",
          label: "article.md",
          kind: "Markdown",
          description: "Markdown 渲染頁面的原始 Markdown source。",
        },
      ],
      searchIndex: [
        {
          title: "靜態網站首頁",
          section: "網站檔案",
          href: "index.html#site-files",
          text: "首頁 入口 頁面連結 Markdown 支援檔 網站檔案索引",
        },
        {
          title: "靜態網站首頁",
          section: "閱讀順序",
          href: "index.html#reading-order",
          text: "章節 教學步驟 文件頁 上一頁 下一頁 閱讀流程",
        },
        {
          title: "範例頁面",
          section: "概覽",
          href: "page.html#overview",
          text: "text-first 靜態資訊網站 範本文章頁 概覽",
        },
        {
          title: "範例頁面",
          section: "細節",
          href: "page.html#details",
          text: "耐用 prose table code block note section anchors",
        },
        {
          title: "Markdown 頁面",
          section: "Markdown 概覽",
          href: "markdown.html#markdown-概覽",
          text: "使用 inline Markdown source 搭配本地 marked parser 和 DOMPurify sanitizer 渲染的範本頁面",
        },
        {
          title: "Markdown 頁面",
          section: "程式碼與表格",
          href: "markdown.html#程式碼與表格",
          text: "Markdown fenced code block table link list technical prose",
        },
      ],
    },
  };

  function normalizeLocale(value) {
    return String(value || "").toLowerCase().startsWith("zh") ? "zh-TW" : "en";
  }

  function currentLocale() {
    const requested = document.body.dataset.locale;
    if (requested && siteData[requested]) {
      return requested;
    }

    const pathLocale = window.location.pathname.split("/").filter(Boolean).slice(-2, -1)[0];
    if (pathLocale && siteData[pathLocale]) {
      return pathLocale;
    }

    return normalizeLocale(navigator.language || defaultLocale);
  }

  function localeData(locale) {
    return siteData[siteData[locale] ? locale : defaultLocale];
  }

  function currentPage(pages) {
    const requestedId = document.body.dataset.page;
    const fileName = window.location.pathname.split("/").pop() || "index.html";
    return pages.find((page) => page.id === requestedId || page.href === fileName) || pages[0];
  }

  function storedPreference() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function storePreference(value) {
    try {
      localStorage.setItem(storageKey, value);
    } catch (error) {
      // The site still works when localStorage is unavailable.
    }
  }

  function createElement(tag, options = {}, children = []) {
    const element = document.createElement(tag);

    if (options.className) {
      element.className = options.className;
    }

    if (options.text) {
      element.textContent = options.text;
    }

    if (options.html) {
      element.innerHTML = options.html;
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([name, value]) => {
        if (value !== null && value !== undefined) {
          element.setAttribute(name, value);
        }
      });
    }

    children.forEach((child) => element.appendChild(child));
    return element;
  }

  function createLink(item, className) {
    return createElement("a", {
      className,
      text: item.label,
      attributes: { href: item.href },
    });
  }

  function createSidebarPanel(id, title, nav) {
    const panel = createElement("section", {
      className: "sidebar-panel",
      attributes: { "data-sidebar-panel": "" },
    });
    const button = createElement("button", {
      className: "sidebar-panel-heading",
      attributes: {
        type: "button",
        "data-sidebar-panel-toggle": "",
        "aria-expanded": "true",
        "aria-controls": id,
      },
    }, [
      createElement("span", { text: title }),
      createElement("span", { className: "accordion-icon", text: "v", attributes: { "aria-hidden": "true" } }),
    ]);
    const body = createElement("div", {
      className: "sidebar-panel-body",
      attributes: { id, "aria-hidden": "false" },
    }, [nav]);

    panel.append(button, body);
    return panel;
  }

  function localeLinks(activePage) {
    return locales.map((locale) => {
      const data = localeData(locale);
      const page = data.pages.find((candidate) => candidate.id === activePage.id) || data.pages[0];
      return {
        id: locale,
        label: data.label,
        href: `../${locale}/${page.href}`,
      };
    });
  }

  function renderLanguageSwitcher(activePage, activeLocale, strings) {
    const links = createElement("div", {
      className: "language-switcher",
      attributes: { "aria-label": strings.languageLabel },
    }, [
      createElement("span", { className: "language-label", text: strings.languageLabel }),
    ]);

    localeLinks(activePage).forEach((item) => {
      const link = createElement("a", {
        text: item.label,
        attributes: { href: item.href, hreflang: item.id },
      });
      if (item.id === activeLocale) {
        link.setAttribute("aria-current", "true");
      }
      links.appendChild(link);
    });

    return links;
  }

  function renderSearch(strings) {
    return createElement("div", {
      className: "site-search",
      attributes: { role: "search" },
    }, [
      createElement("label", {
        className: "site-search-label",
        text: strings.searchLabel,
        attributes: { for: "site-search-input" },
      }),
      createElement("input", {
        className: "site-search-input",
        attributes: {
          id: "site-search-input",
          type: "search",
          autocomplete: "off",
          placeholder: strings.searchPlaceholder,
          "data-site-search": "",
          "aria-controls": "site-search-results",
        },
      }),
      createElement("div", {
        className: "site-search-results",
        attributes: {
          id: "site-search-results",
          "data-site-search-results": "",
          role: "list",
          "aria-live": "polite",
        },
      }),
    ]);
  }

  function renderSidebar(activePage, data, activeLocale) {
    const mount = document.querySelector("[data-site-sidebar]");
    if (!mount) {
      return null;
    }

    const strings = data.strings;
    const aside = createElement("aside", {
      className: "layout-sidebar",
      attributes: { id: "site-sidebar", "aria-label": strings.sidebarLabel },
    });
    const scroll = createElement("div", { className: "sidebar-scroll" });
    const brand = createElement("a", {
      className: "sidebar-brand",
      attributes: { href: "index.html" },
    }, [
      createElement("span", { className: "sidebar-kicker", text: strings.brandKicker }),
      createElement("span", { text: strings.brandTitle }),
    ]);

    const siteNav = createElement("nav", {
      className: "site-nav",
      attributes: { "aria-label": strings.sitePages },
    });

    data.pages.forEach((page) => {
      const link = createLink(page);
      if (page.id === activePage.id) {
        link.setAttribute("aria-current", "page");
      }
      siteNav.appendChild(link);
    });

    const pageNav = createElement("nav", {
      className: "site-nav",
      attributes: { "aria-label": strings.pageSections },
    });

    activePage.sections.forEach((section) => {
      pageNav.appendChild(createLink(section));
    });

    const panels = createElement("div", { className: "sidebar-nav-panels" }, [
      createSidebarPanel("site-page-sections", strings.pageSections, pageNav),
      createSidebarPanel("site-page-list", strings.sitePages, siteNav),
    ]);

    scroll.append(brand, renderSearch(strings), panels, renderLanguageSwitcher(activePage, activeLocale, strings));
    aside.appendChild(scroll);
    mount.replaceChildren(aside);
    return aside;
  }

  function renderTopBar(activePage, strings) {
    const mount = document.querySelector("[data-site-topbar]");
    if (!mount) {
      return null;
    }

    const bar = createElement("div", { className: "menu-bar" });
    const button = createElement("button", {
      className: "sidebar-toggle",
      attributes: {
        type: "button",
        "data-sidebar-toggle": "",
        "aria-label": strings.toggleAriaLabel,
        "aria-expanded": "true",
        "aria-controls": "site-sidebar",
      },
    }, [
      createElement("span", { className: "sidebar-toggle-icon", html: "<span></span><span></span><span></span>" }),
      createElement("span", { className: "visually-hidden", text: strings.toggleHiddenText }),
    ]);
    const title = createElement("span", { className: "menu-title", text: activePage.title });

    bar.append(button, title);
    mount.replaceChildren(bar);
    return button;
  }

  function renderPager(activePage, data) {
    const mount = document.querySelector("[data-site-pager]");
    if (!mount) {
      return;
    }

    const strings = data.strings;
    const index = data.pages.findIndex((page) => page.id === activePage.id);
    const previous = data.pages[index - 1];
    const next = data.pages[index + 1];
    const nav = createElement("nav", {
      className: "page-nav",
      attributes: { "aria-label": strings.pagerLabel },
    });

    nav.appendChild(previous ? pagerLink(previous, strings.previous, "prev") : pagerPlaceholder(strings.previous));

    if (activePage.id === "index") {
      nav.appendChild(createElement("span", {
        className: "page-nav-home is-current",
        text: strings.homeCurrent,
      }));
    } else {
      nav.appendChild(createElement("a", {
        className: "page-nav-home",
        text: strings.backHome,
        attributes: { href: "index.html" },
      }));
    }

    nav.appendChild(next ? pagerLink(next, strings.next, "next") : pagerPlaceholder(strings.next));
    mount.replaceChildren(nav);
  }

  function pagerLink(page, label, direction) {
    const wrapper = createElement("a", {
      className: `page-nav-link ${direction}`,
      attributes: { href: page.href, "aria-label": `${label}: ${page.label}` },
    });
    wrapper.append(
      createElement("span", { className: "page-nav-label", text: label }),
      createElement("strong", { text: page.label }),
    );
    return wrapper;
  }

  function pagerPlaceholder(label) {
    return createElement("span", {
      className: "page-nav-link is-disabled",
      text: label,
    });
  }

  function renderFooter(strings) {
    const mount = document.querySelector("[data-site-footer]");
    if (!mount) {
      return;
    }

    const footer = createElement("footer", { className: "page-footer" }, [
      createElement("div", {
        className: "footer-inner",
        text: strings.footerText,
      }),
    ]);
    mount.replaceChildren(footer);
  }

  function renderIndexFiles(data) {
    const mount = document.querySelector("[data-site-index-files]");
    if (!mount) {
      return;
    }

    const markdownFiles = data.supportFiles.filter((file) => file.kind === "Markdown");
    const allFiles = [
      ...data.pages.map((page) => ({
        href: page.href,
        label: page.href,
        kind: data.strings.pageKind,
        description: page.description,
      })),
      ...markdownFiles.map((file) => ({
        ...file,
        kind: data.strings.markdownKind,
      })),
    ];

    const list = createElement("div", { className: "file-grid" });
    allFiles.forEach((file) => {
      const card = createElement("a", {
        className: "file-card",
        attributes: { href: file.href },
      }, [
        createElement("span", { className: "file-kind", text: file.kind }),
        createElement("strong", { text: file.label }),
        createElement("span", { text: file.description }),
      ]);
      list.appendChild(card);
    });

    mount.replaceChildren(list);
  }

  function renderReadingOrder(data) {
    const mount = document.querySelector("[data-site-reading-order]");
    if (!mount) {
      return;
    }

    const list = createElement("ol", { className: "reading-list" });
    data.pages.forEach((page) => {
      const item = createElement("li", {}, [
        createElement("a", {
          text: page.label,
          attributes: { href: page.href },
        }),
        createElement("p", { text: page.description }),
      ]);
      list.appendChild(item);
    });
    mount.replaceChildren(list);
  }

  function markdownLibrariesAvailable() {
    return Boolean(
      window.marked &&
      typeof window.marked.parse === "function" &&
      window.DOMPurify &&
      typeof window.DOMPurify.sanitize === "function",
    );
  }

  function inlineMarkdownSource(container) {
    const source = container.querySelector("[data-markdown-source]");
    if (!source) {
      return "";
    }

    return source.textContent.replace(/^\n/, "").trimEnd();
  }

  function canFetchMarkdownSource() {
    return window.location.protocol !== "file:";
  }

  async function markdownSource(container, strings, fallbackSource = inlineMarkdownSource(container)) {
    const src = container.getAttribute("data-markdown-src");

    if (src && canFetchMarkdownSource()) {
      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      } catch (error) {
        if (fallbackSource) {
          return fallbackSource;
        }
        throw error;
      }
    }

    if (fallbackSource) {
      return fallbackSource;
    }

    if (src) {
      throw new Error(strings.markdownFileProtocol);
    }

    return "";
  }

  function renderMarkdownStatus(container, message, isError = false) {
    container.replaceChildren(createElement("p", {
      className: `markdown-status${isError ? " markdown-error" : ""}`,
      text: message,
    }));
  }

  function slugifyHeading(text) {
    const slug = String(text || "")
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    return slug || "section";
  }

  function ensureHeadingIds(container) {
    const used = new Set();

    container.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
      if (heading.id) {
        used.add(heading.id);
        return;
      }

      const base = slugifyHeading(heading.textContent);
      let slug = base;
      let counter = 2;

      while (used.has(slug) || document.getElementById(slug)) {
        slug = `${base}-${counter}`;
        counter += 1;
      }

      heading.id = slug;
      used.add(slug);
    });
  }

  function normalizeMarkdownLinks(container) {
    container.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  function syntaxHighlightingAvailable() {
    return Boolean(window.Prism && typeof window.Prism.highlightAllUnder === "function");
  }

  function highlightCodeBlocks(container = document) {
    const target = container || document;

    target.querySelectorAll("pre code").forEach((code) => {
      const block = code.closest("pre");
      if (block) {
        block.classList.add("code-block");
      }
    });

    if (syntaxHighlightingAvailable()) {
      window.Prism.highlightAllUnder(target);
    }
  }

  async function renderMarkdownPage(container, strings) {
    if (!markdownLibrariesAvailable()) {
      renderMarkdownStatus(container, strings.markdownMissingLibraries, true);
      return;
    }

    const fallbackSource = inlineMarkdownSource(container);
    renderMarkdownStatus(container, strings.markdownLoading);

    try {
      const source = await markdownSource(container, strings, fallbackSource);
      const rendered = window.marked.parse(source, { gfm: true, breaks: false });
      const html = await Promise.resolve(rendered);
      const safeHtml = window.DOMPurify.sanitize(html);
      container.innerHTML = safeHtml;
      ensureHeadingIds(container);
      normalizeMarkdownLinks(container);
      highlightCodeBlocks(container);
    } catch (error) {
      console.warn("Markdown render failed:", error);
      renderMarkdownStatus(container, strings.markdownLoadError, true);
    }
  }

  function renderMarkdownPages(data) {
    document.querySelectorAll("[data-markdown-page]").forEach((container) => {
      renderMarkdownPage(container, data.strings);
    });
  }

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function searchMatches(query, searchIndex) {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      return [];
    }

    return searchIndex
      .map((entry) => {
        const haystack = normalize(`${entry.title} ${entry.section} ${entry.text}`);
        if (!terms.every((term) => haystack.includes(term))) {
          return null;
        }

        const title = normalize(entry.title);
        const section = normalize(entry.section);
        const score = terms.reduce((total, term) => {
          if (title.includes(term)) return total + 4;
          if (section.includes(term)) return total + 3;
          return total + 1;
        }, 0);
        return { entry, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((match) => match.entry);
  }

  function excerpt(text, query) {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    const source = String(text || "");
    const lower = normalize(source);
    const firstIndex = terms.reduce((best, term) => {
      const index = lower.indexOf(term);
      if (index === -1) return best;
      return best === -1 ? index : Math.min(best, index);
    }, -1);
    const start = Math.max(0, firstIndex - 42);
    const snippet = source.slice(start, start + 150).trim();
    return `${start > 0 ? "... " : ""}${snippet}${start + 150 < source.length ? " ..." : ""}`;
  }

  function renderSearchResults(mount, query, searchIndex, strings) {
    const matches = searchMatches(query, searchIndex);
    mount.replaceChildren();

    if (!query.trim()) {
      mount.hidden = true;
      return;
    }

    mount.hidden = false;

    if (!matches.length) {
      mount.appendChild(createElement("p", { className: "site-search-empty", text: strings.searchEmpty }));
      return;
    }

    matches.forEach((entry) => {
      const result = createElement("a", {
        className: "site-search-result",
        attributes: { href: entry.href, role: "listitem" },
      }, [
        createElement("strong", { text: entry.title }),
        createElement("span", { text: entry.section }),
        createElement("small", { text: excerpt(entry.text, query) }),
      ]);
      mount.appendChild(result);
    });
  }

  function applySidebarState(sidebar, toggle, value) {
    const isVisible = value === "visible";

    root.classList.toggle("sidebar-visible", isVisible);
    root.classList.toggle("sidebar-hidden", !isVisible);
    toggle.setAttribute("aria-expanded", String(isVisible));
    sidebar.setAttribute("aria-hidden", String(!isVisible));

    sidebar.querySelectorAll("a, button, input").forEach((control) => {
      control.tabIndex = isVisible ? 0 : -1;
    });
  }

  function defaultSidebarState() {
    if (!desktopQuery.matches) {
      return "hidden";
    }

    return storedPreference() === "hidden" ? "hidden" : "visible";
  }

  function wireSidebar(sidebar, toggle) {
    if (!sidebar || !toggle) {
      return;
    }

    applySidebarState(sidebar, toggle, defaultSidebarState());

    toggle.addEventListener("click", () => {
      const isVisible = root.classList.contains("sidebar-visible");
      const nextState = isVisible ? "hidden" : "visible";
      applySidebarState(sidebar, toggle, nextState);
      storePreference(nextState);
    });

    sidebar.addEventListener("click", (event) => {
      if (!desktopQuery.matches && event.target.closest("a")) {
        applySidebarState(sidebar, toggle, "hidden");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !desktopQuery.matches) {
        applySidebarState(sidebar, toggle, "hidden");
      }
    });

    desktopQuery.addEventListener("change", () => {
      applySidebarState(sidebar, toggle, defaultSidebarState());
    });
  }

  function setSidebarPanelExpanded(panel, button, body, isExpanded) {
    button.setAttribute("aria-expanded", String(isExpanded));
    body.hidden = !isExpanded;
    body.setAttribute("aria-hidden", String(!isExpanded));
    panel.classList.toggle("is-collapsed", !isExpanded);
  }

  function wireSidebarPanels(sidebar) {
    sidebar.querySelectorAll("[data-sidebar-panel]").forEach((panel) => {
      const button = panel.querySelector("[data-sidebar-panel-toggle]");
      if (!button) {
        return;
      }

      const body = document.getElementById(button.getAttribute("aria-controls"));
      if (!body) {
        return;
      }

      setSidebarPanelExpanded(panel, button, body, button.getAttribute("aria-expanded") !== "false");

      button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";
        setSidebarPanelExpanded(panel, button, body, !isExpanded);
      });
    });
  }

  function wireSearch(sidebar, data) {
    const input = sidebar.querySelector("[data-site-search]");
    const results = sidebar.querySelector("[data-site-search-results]");
    if (!input || !results) {
      return;
    }

    results.hidden = true;
    input.addEventListener("input", () => {
      renderSearchResults(results, input.value, data.searchIndex, data.strings);
    });
  }

  function init() {
    const locale = currentLocale();
    const data = localeData(locale);
    const activePage = currentPage(data.pages);
    const sidebar = renderSidebar(activePage, data, locale);
    const toggle = renderTopBar(activePage, data.strings);
    renderPager(activePage, data);
    renderFooter(data.strings);
    renderIndexFiles(data);
    renderReadingOrder(data);
    renderMarkdownPages(data);
    highlightCodeBlocks(document);
    wireSidebar(sidebar, toggle);
    wireSidebarPanels(sidebar);
    wireSearch(sidebar, data);

    window.StaticSite = {
      currentLocale: locale,
      localeLinks: localeLinks(activePage),
      pages: data.pages,
      supportFiles: data.supportFiles,
      searchIndex: data.searchIndex,
      siteData,
    };
  }

  init();
})();
