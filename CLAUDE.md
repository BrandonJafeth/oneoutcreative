# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # dev server at localhost:4321
pnpm build      # production build → ./dist/
pnpm preview    # preview production build locally
pnpm astro      # Astro CLI (e.g. astro add, astro check)
```

Type-check via `pnpm astro check`. No lint or test scripts configured.

## Architecture

Astro 6 project with Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.*` file).

**Key directories:**
- `src/pages/` — file-based routes
- `src/layouts/Layout.astro` — global HTML shell; imports `global.css`; includes IntersectionObserver script
- `src/components/` — all page sections as `.astro` components
- `src/styles/global.css` — Tailwind entry point + CSS theme tokens + animations
- `public/` — static assets served as-is

**Component order in `index.astro`:** Navbar → Hero → ComoFunciona → FeaturesGrid → Testimonios → FAQ → CtaFooter

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

## Design system

- Orange `#e87722` = single accent. One instance per viewport — CTAs, hero stat, card accents.
- `liquid-glass` / `liquid-glass-strong` — defined in `global.css` `@layer components`.
- All CTAs use `rounded-full` (pill shape). No rectangular buttons.
- Section alternation: `bg-background` → `bg-card` → `bg-background` → `bg-card` → `bg-background`.
- Section padding: `py-24 md:py-32`.

## Animations

- Hero elements: CSS `animate-fade-up` + `delay-0` through `delay-6` classes (defined in `global.css`).
- Scroll-triggered sections: `data-animate` attribute + IntersectionObserver in `Layout.astro` adds `is-visible` class. Each card gets `style="transition-delay: Xs"` for stagger.

## Fonts

Served locally via Fontsource (no Google Fonts requests):
- `@fontsource/bebas-neue` → `font-heading`
- `@fontsource-variable/inter` → `font-body`
