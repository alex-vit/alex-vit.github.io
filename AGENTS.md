# alexv.lv — Personal Website

Static HTML site hosted on GitHub Pages at `www.alexv.lv`.

## Stack

- Plain HTML + CSS, no framework or static site generator
- Each page is self-contained (no shared template/layout engine)
- Shared stylesheet: `style.css` (CSS custom properties, light/dark via `prefers-color-scheme`)
- Hosting: GitHub Pages (see `CNAME`)

## Architecture

Pages use one of two layout patterns:
- **Homepage** (`index.html`): direct `<body>` with semantic `<header>`, `<main>`, `<footer>`
- **Subpages**: `<div class="page-wide"><div class="content">` wrapper, linking `../style.css`

## Pages

| Path | Description |
|------|-------------|
| `index.html` | Homepage / portfolio |
| `llm-ports/index.html` | Blog post: porting a program to 10 languages |
| `ci-2025/index.html` | Photo essay: Côte d'Ivoire trips |
| `qr-wallpaper/index.html` | QR wallpaper generator tool |
| `cats/privacy-policy.html` | Privacy policy for a mobile app |
| `useless-toolbox/` | Collection of old web tools (frozen, see below) |

## Rules

1. **Do not modify anything under `useless-toolbox/`**. These are archived relics, kept as-is.
2. **GoatCounter analytics** must be present on every page that has a `</body>` tag. Place this snippet immediately before `</body>`:
   ```html
   <script data-goatcounter="https://alexv.goatcounter.com/count"
       async src="//gc.zgo.at/count.js"></script>
   ```
3. New pages should use the subpage pattern (`page-wide` > `content`), link `../style.css`, and include a back-link to `/`.
4. Keep pages lightweight. No build step, no npm, no bundler.
5. Commit messages: 2-5 words, lowercase, no conventional-commits prefixes.
