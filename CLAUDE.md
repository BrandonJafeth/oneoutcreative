# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # dev server at localhost:4321
pnpm build            # production build → ./dist/
pnpm preview          # preview production build locally
pnpm astro            # Astro CLI (e.g. astro add, astro check)
pnpm wrangler         # Cloudflare CLI
```

Type-check via `pnpm astro check`. No lint or test scripts configured.

## Architecture

Astro 6 project with Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.*` file). Deployed on **Cloudflare Pages** via `@astrojs/cloudflare` adapter.

**Key directories:**
- `src/pages/` — file-based routes
- `src/layouts/Layout.astro` — global HTML shell; imports `global.css`; includes IntersectionObserver script; renders `CustomCursor`
- `src/components/` — all page sections as `.astro` components
- `src/styles/global.css` — Tailwind entry point + CSS theme tokens + animations
- `public/` — static assets served as-is

**Pages / routes:**
| Route | File | Notes |
|-------|------|-------|
| `/` | `src/pages/index.astro` | Homepage |
| `/diseno-marca` | `src/pages/diseno-marca.astro` | Brand & design service page |
| `/sistemas-web` | `src/pages/sistemas-web.astro` | Web systems service page |

**Component order in `index.astro`:** Navbar → Hero → Clientes → ServiciosSplit → ComoFunciona → FeaturesGrid → Testimonios → FAQ → CtaFooter

**All components:**
- `Navbar.astro` — Fixed; shrinks on scroll; hamburger mobile menu with animated lines + overlay
- `Hero.astro` — Video background with poster, dot grid, scroll line animation
- `Clientes.astro` — Logo marquee with doubled array for seamless loop
- `ServiciosSplit.astro` — Alternating split panels; scroll-triggered reveal
- `ComoFunciona.astro` — Numbered steps
- `FeaturesGrid.astro` — Feature cards grid
- `Testimonios.astro` — `.testi-grid` staggered 2-col layout
- `FAQ.astro` — Accordion
- `CtaFooter.astro` — Final CTA
- `CustomCursor.astro` — Animated cursor blob (mouse tracking via `requestAnimationFrame`); disabled on touch devices; uses `color-mix()` with `--accent`

## Content editing

Section content lives in `src/data/` as JSON — edit these files, not the components:

| File | Section | Keys |
|------|---------|------|
| `src/data/faqs.json` | FAQ | `pregunta`, `respuesta` |
| `src/data/testimonios.json` | Testimonios | `quote`, `name`, `role`, `metric` |
| `src/data/features.json` | FeaturesGrid | `titulo`, `texto`, `icon` |
| `src/data/pasos.json` | ComoFunciona steps | `n`, `t`, `d` |
| `src/data/clientes.json` | Clientes marquee | array of strings |
| `src/data/servicios.json` | ServiciosSplit | `eyebrow`, `kind`, `title`, `body`, `image`, `href` |

Components import from JSON — never hardcode data in `.astro` files.
Service pages (`/diseno-marca`, `/sistemas-web`) currently use hardcoded arrays — exception to the rule.

## Tailwind v4 — CSS-first config

Theme tokens live in `src/styles/global.css` under `@theme`. No JS config file:

```css
@theme {
  --color-background: #0a0a0a;  /* bg-background */
  --color-card:       #161616;  /* bg-card */
  --color-accent:     #e87722;  /* text-accent / bg-accent */
  --font-heading:     "Bebas Neue", sans-serif;  /* font-heading */
  --font-body:        "Inter Variable", sans-serif;  /* font-body */
}
```

**Extended CSS variables (`:root`):**
- `--fg`, `--fg-rgb` — foreground color + RGB channels for transparency
- `--bg`, `--card`, `--accent` — shorthand aliases
- `--muted`, `--muted-stronger` — text opacity levels
- `--soft-text`, `--hairline`, `--hairline-strong` — subtle text and border colors

Light mode overrides all variables via `html.light` selector (theme toggle exists but not wired to UI yet).

## Design system

- Orange `#e87722` = single accent. One instance per viewport — CTAs, hero stat, card accents.
- All CTAs use `rounded-full` (pill shape). No rectangular buttons.
- Section alternation: `bg-background` → `bg-card` → `bg-background` → `bg-card` → `bg-background`.
- Section padding: `py-24 md:py-32`.
- All images served via **Cloudinary CDN** (no images in repo).
- WhatsApp CTA: `wa.me/50689000108`.

**`@layer components` classes in `global.css`:**
| Class | Purpose |
|-------|---------|
| `liquid-glass` | Frosted glass card (inset border + gradient overlay) |
| `liquid-glass-strong` | Stronger frosted glass variant |
| `btn-primary` | Orange pill button; hover `#c4621a` |
| `btn-ghost` | Transparent pill button with hover bg |
| `btn-link` | Minimal link button |
| `eyebrow` / `eyebrow.accent` | Small uppercase label with dot prefix |
| `sec-heading` | Responsive section heading (`clamp(2.5rem, 4.5rem)`) |
| `split-panel` / `split-panel.reverse` | Alternating layout with order reversal |
| `service-image-wrap` | 1:1 aspect ratio wrapper with corner index + badges |
| `testi-grid` | Staggered 2-col testimonial grid |
| `testi-card` | Testimonial card (2.5rem padding, flex column) |
| `marquee-wrapper` / `marquee-track` | Infinite horizontal scroll with mask fade |
| `reveal-hidden` / `reveal-visible` | Scroll-triggered fade-up with blur |

## Animations

**Hero:** CSS `animate-fade-up` + `delay-0` through `delay-6` classes (defined in `global.css`).

**Scroll-triggered:** `data-animate` attribute → IntersectionObserver in `Layout.astro` (threshold `0.1`, rootMargin `-80px`) adds `is-visible` class. Stagger via inline `style="transition-delay: Xs"`.

**Keyframe animations in `global.css`:**
- `fade-up` — opacity + translateY + blur
- `marquee` — `translateX(-50%)` infinite loop
- `scroll-line` — falling scroll indicator

## Fonts

Served locally via Fontsource (no Google Fonts requests):
- `@fontsource/bebas-neue` → `font-heading`
- `@fontsource-variable/inter` → `font-body`

## Deployment

- Adapter: `@astrojs/cloudflare` (configured in `astro.config.mjs`)
- CLI: `wrangler` v4 — run `pnpm wrangler generate-types` after changing Cloudflare bindings
- React integration installed (`@astrojs/react`) but no React components exist yet
