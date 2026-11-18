# Andrea Wear

Andrea Wear is a fashion storefront built with Next.js, React, TypeScript, and MUI Material. The interface includes product browsing, category filters, product details, a cart, checkout, wishlists, order tracking, and an admin dashboard.

## Requirements

- Node.js
- pnpm 11 (the package manager version specified by this project)
- A compatible Andrea Wear API for catalog, checkout, wishlist, order tracking, and admin data

The API is a separate service and is not included in this repository.

## Run locally

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env.local` and set the API base URL if your backend runs elsewhere. The example points to `http://localhost:5273`.

   ```bash
   cp .env.example .env.local
   ```

   PowerShell equivalent:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Start the frontend:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Admin dashboard

Open `/admin` to view the dashboard. The frontend does not ask for an admin access code. Admin data and write operations are still handled by the API, which may enforce its own authentication and authorization. If the API protects those endpoints, the dashboard can open while its data or management actions remain unavailable.

## Available scripts

- `pnpm dev` — start the development server
- `pnpm build` — create a production build
- `pnpm start` — serve the production build
- `pnpm lint` — run ESLint
- `pnpm typecheck` — run the TypeScript compiler without emitting files

## Project structure

- `app/` — Next.js root layout and providers
- `src/components/` — shared MUI components and product presentation
- `src/store-pages/` — storefront and admin pages
- `src/lib/api.ts` — HTTP client and API data mapping
- `public/images/products/` — local product image assets
