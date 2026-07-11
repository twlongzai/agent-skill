# Vendored Browser Libraries

These files are copied into generated static sites when Markdown rendering or syntax highlighting is needed.

- `marked.umd.js`: `marked` 18.0.5, from the npm package tarball.
- `purify.min.js`: `dompurify` 3.4.11, from the npm package tarball.
- `prismjs/prism-nearloop.min.js`: PrismJS 1.29.0 core plus markup, CSS, JavaScript, Bash, JSON, TOML, Rust, YAML, and Markdown grammars, from the npm package tarball.
- `prismjs/LICENSE`: PrismJS MIT license.

Keep these files local so generated sites can run without CDNs, build tooling, or package installation.
