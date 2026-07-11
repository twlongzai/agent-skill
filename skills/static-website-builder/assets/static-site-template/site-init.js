(function () {
  window.Prism = window.Prism || {};
  window.Prism.manual = true;

  try {
    const desktop = window.matchMedia("(min-width: 901px)").matches;
    const stored = localStorage.getItem("static-site-sidebar");
    const state = desktop && stored !== "hidden" ? "sidebar-visible" : "sidebar-hidden";
    document.documentElement.classList.add(state);
  } catch (error) {
    document.documentElement.classList.add("sidebar-visible");
  }
})();
