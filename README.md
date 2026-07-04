# Vera Mountney Website

Premium bilingual (DE/EN) personal brand website for [vera-mountney.de](https://vera-mountney.de).

Built with **Vite**, **React**, **TypeScript**, **Tailwind CSS**, and **i18next**. Deployed automatically to Namecheap shared hosting via GitHub Actions (FTPS).

## Features

- Bilingual German / English (default: German)
- Dark / light theme (default: dark, persisted in localStorage)
- Responsive, premium UI with subtle animations
- Pages: Home, About, Services, Book, Contact, FAQ
- Contact form (mailto handoff), WhatsApp CTA, chatbot with local knowledge base
- Data-driven content in `src/content/` and `src/data/`

## Local development

```bash
npm install
cp .env.example .env   # optional: set book purchase URLs
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

Static output is written to `dist/`.

## Project structure

```
src/
  components/     # Reusable UI components
  pages/          # Route pages
  layouts/        # Layout wrappers
  content/        # de.ts / en.ts translations
  data/           # Services, profile, FAQ, chatbot, book links
  hooks/          # Custom hooks
  context/        # Theme provider
  styles/         # Global CSS + Tailwind
public/
  assets/images/  # Profile, book covers, branding images
```

## Assets

Place client images in:

- `public/assets/images/profile/vera-mountney-main.jpg`
- `public/assets/images/books/when-the-bats-fly-i-dream-of-nigeria-en.jpg`
- `public/assets/images/books/wenn-fledermaeuse-fliegen-traeume-ich-von-nigeria-de.jpg`
- `public/assets/images/branding/` (optional)

## Deployment

Deployment runs automatically on push to `main` via `.github/workflows/deploy.yml`.

The workflow:

1. Installs dependencies
2. Builds the Vite site
3. Uploads `dist/` to the FTP server via FTPS

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `FTP_SERVER` | FTP server hostname |
| `FTP_USERNAME` | FTP account username |
| `FTP_PASSWORD` | FTP account password |
| `FTP_PORT` | FTP port (e.g. `21`) |
| `DEPLOY_DIR` | Target directory on the server (e.g. `./`) |

### Optional GitHub Variables

For book purchase URLs at build time:

| Variable | Description |
|----------|-------------|
| `VITE_BOOK_BUY_URL_EN` | English edition purchase link |
| `VITE_BOOK_BUY_URL_DE` | German edition purchase link |
| `VITE_BOOK_AUTHOR_URL` | Author / book info page link |

Do not commit passwords or FTP credentials to this repository.

## Content updates

Edit translation files for text changes:

- `src/content/de.ts`
- `src/content/en.ts`

Edit structured data for services, contact info, and chatbot:

- `src/data/profile.ts`
- `src/data/services.ts`
- `src/data/bookLinks.ts`
- `src/data/faq.ts`
- `src/data/chatbotKnowledge.ts`

## Phase 2 (planned)

- Framer Motion / GSAP animations
- Testimonials & guestbook
- Blog
- Full appointment booking
- Optional AI-backed chatbot
- Direct book sales
