# GEMINI.md

## Project Overview
**Kuyuri Iroha** is a portfolio website built with **Next.js 15 (App Router)**, **React 19**, and **TypeScript**. It showcases projects and profile information using a local content management approach with YAML files.

**Key Technologies:**
*   **Framework:** Next.js 15 (App Router, Turbopack)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4
*   **Animation:** GSAP
*   **Content:** Local YAML files (`src/content`), parsed with `js-yaml`
*   **Legacy/Migration:** `microcms-js-sdk` is present, suggesting a past or hybrid integration with microCMS, but `src/lib/content.ts` currently sources data from local files.

## Architecture & Directory Structure

*   **`src/app/`**: Next.js App Router pages.
    *   `layout.tsx`: Root layout.
    *   `page.tsx`: Home page.
    *   `projects/[id]/page.tsx`: Dynamic route for project details.
    *   `about/page.tsx`: About page.
*   **`src/content/`**: The "database" for the application.
    *   `projects/`: Individual YAML files for each project (e.g., `20250927_yoro_expo.yml`).
    *   `about.yml`: Profile information.
*   **`src/lib/content.ts`**: Data access layer. Functions to read and type-check YAML content.
*   **`src/components/`**: Reusable UI components (`ProjectCard`, `Header`, `Footer`).
*   **`public/images/`**: Static assets, organized by project ID.

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```
*   Runs `next dev --turbopack` on `http://localhost:3000`.

### 2. Manage Content
*   **Add/Edit Project:** Create or modify a `.yml` file in `src/content/projects/`.
*   **Schema:** Refer to the `Project` type in `src/lib/content.ts` for valid fields.
*   **Images:** Place images in `public/images/projects/<project_id>/`. Reference them in the YAML file relative to the public root (e.g., `/images/projects/...`).

### 3. Build & Production
```bash
npm run build
npm start
```
*   `postbuild` script cleans up Next.js cache (`scripts/cleanup-next-cache.mjs`).

### 4. Linting
```bash
npm run lint
```

## Coding Conventions
*   **Strict TypeScript:** All new code must be typed.
*   **Path Aliases:** Use `@/` to import from `src/` (e.g., `@/components/Header`).
*   **Tailwind CSS:** Use utility classes for styling.
*   **Component Structure:** Functional components with named exports.
*   **Data Fetching:** Use functions from `@/lib/content` to fetch data in Server Components.

## Key Files
*   `src/lib/content.ts`: **Crucial.** Defines the data schema (types) and loading logic. Check this first if changing data structures.
*   `next.config.ts`: Next.js configuration.
*   `tailwind.config.ts`: (Implicit in v4 or configured via CSS/PostCSS) - Check `globals.css` or `postcss.config.mjs`.

## Notes for Agents
*   **Content Source:** Although `microCMS` is mentioned in docs and scripts, the application currently renders from **local YAML files** in `src/content`. When asked to update content, modify these files.
*   **Image Handling:** Ensure images exist in `public/` before referencing them in YAML.
