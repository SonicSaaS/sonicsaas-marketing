# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

Public marketing site for [sonicsaas.com](https://sonicsaas.com). Static Next.js 15 site deployed to Azure Static Web Apps.

**This repo is only the marketing/landing site.** It has no backend, no database, no auth — just static pages. Content changes here, product changes elsewhere.

## SonicSaaS Repos

| Repo | Responsibility |
|------|---------------|
| **sonicsaas-marketing** (this) | Public marketing site, landing pages, legal/policy pages, waitlist form |
| **sonicsaas-app** | Core product — SonicWall fleet management app (Next.js 16, Postgres, Stripe, Auth) |
| **sonicsaas-dev** | Deployment infra, CI/CD pipelines, Docker, security scanning, git hooks |
| **sonicsaas-docs** | End-user documentation portal (Nextra) |
| **sonicsaas-business** | Business strategy, pricing, GTM planning, decision records |

**Boundary rules:**
- Marketing site links to the app via `NEXT_PUBLIC_APP_URL` — it never imports app code
- Waitlist `/api/waitlist` is an Azure Function in the `api/` folder of this repo (deployed as SWA managed function)
- Brand assets and design tokens (colors, fonts) are defined here in `globals.css` — the app has its own design system
- Business strategy docs live in `sonicsaas-business/docs/`, not here

## Commands

Site commands run from the `site/` directory:

```bash
npm run dev      # Dev server on port 3002
npm run build    # Production build (static export to out/)
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

API commands run from the `api/` directory:

```bash
npm run build    # Compile TypeScript to dist/
npm start        # Run Azure Functions host locally
```

## Architecture

- **Static export**: `next build` outputs to `site/out/`. Pre-built HTML/JS/CSS is committed to git for Azure SWA deployment.
- **Styling**: Tailwind CSS 4 with CSS custom properties for light/dark theming. Brand color is orange `hsl(24 94% 50%)`.
- **Components**: Server Components by default; `"use client"` for interactive pieces (waitlist form, theme toggle).
- **Legal pages**: Use shared `LegalPage` wrapper component.
- **Waitlist form**: Posts to `/api/waitlist` — Azure Function in `api/src/functions/waitlist.ts`, stores signups in Azure Table Storage.

## Environment

- `NEXT_PUBLIC_APP_URL` — URL to the main SonicSaaS app (e.g., `https://app.sonicsaas.com`). See `site/.env.example`.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml` which deploys to Azure SWA. PRs get preview deployments. Requires `AZURE_STATIC_WEB_APPS_API_TOKEN` secret.
