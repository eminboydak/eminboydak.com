# eminboydak.com

Emin Boydak'ın kişisel web sitesi — portföy, blog ve iletişim.

## Tech Stack

- **Astro** 7 (SSG) + **Preact** (etkileşimli bileşenler)
- **Tailwind CSS** 4 + **DaisyUI** 5 (black theme)
- **i18n** — TR (varsayılan) / EN (`/en`)
- **SEO** — OG tags, JSON-LD Person schema, sitemap, robots.txt

## Project Structure

```
src/
├── components/      # UI bileşenleri (Header, Footer, Card, ...)
├── i18n/            # Sözlükler (tr.ts, en.ts)
├── layouts/         # BaseLayout (SEO + header + footer)
├── lib/             # Yardımcılar (ui-classes, blog helpers)
├── pages/           # Rotalar (TR + en/)
├── content/         # Blog yazıları (tr/ + en/)
└── styles/          # global.css
public/              # Statik varlıklar (favicon, og.png, ...)
```

## Commands

| Command | Action |
|:--------|:-------|
| `npm install` | Bağımlılıkları yükle |
| `npm run dev` | Dev server (`localhost:4321`) |
| `npm run build` | Production build (`./dist/`) |
| `npm run preview` | Build'i yerelde önizle |
| `npx playwright test` | E2E testler |

## Deployment

Cloudflare Pages — `main` branch push edildiğinde otomatik deploy.

- Build command: `npm run build`
- Output directory: `dist`
