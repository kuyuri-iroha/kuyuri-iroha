# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `src/app`, with route groups such as `about/` and `projects/` managing page-level UI and loaders. Reusable UI is collected under `src/components` (`Header.tsx`, `Footer.tsx`, `ProjectCard.tsx`), while shared content data lives in YAML under `src/content/` and is loaded via `src/lib/content.ts`. Static assets belong in `public/`, and helper tooling such as `scripts/convert-assets-to-local.mjs` stays in `scripts/`. Keep new source files inside `src/` so the `@/*` TypeScript path alias resolves correctly.

## Build, Test, and Development Commands
- `npm run dev` launches the Turbopack dev server on http://localhost:3000.  
- `npm run build` creates the production bundle; run it before shipping config changes.  
- `npm start` serves the last production build locally for smoke-testing.  
- `npm run lint` runs the Next.js ESLint preset; resolve warnings before opening a PR.  
- `node scripts/convert-assets-to-local.mjs` downloads remote asset URLs defined in YAML and converts them to local `public/images` paths.

## Coding Style & Naming Conventions
Use TypeScript and functional React components exclusively; favor default exports for pages and PascalCase component names (`ProjectCard.tsx`). Indent with two spaces, and keep JSX blocks small and composable. Tailwind CSS v4 classes drive styling—group utility classes by layout → spacing → typography to stay consistent with existing files. Import shared modules through the `@/` alias, and prefer descriptive prop names over abbreviations.

## Testing Guidelines
Automated tests are not configured yet; describe manual verification steps in every PR. When adding tests, colocate them under `src/__tests__/` or next to the component with a `.test.tsx` suffix and wire an `npm test` script so future runs are reproducible. Aim for lightweight component tests with React Testing Library plus microCMS fixture data, and document any new coverage expectations in your PR.

## Commit & Pull Request Guidelines
Recent commits are short, task-focused statements (often Japanese descriptors like `Vercelへのデプロイ時対応`); keep following that concise style in the imperative mood. Group related changes per commit, reference issue IDs in the message body when relevant, and avoid noise commits. Pull requests should include a clear summary, screenshots or recordings for UI tweaks, environment assumptions (e.g., required microCMS entries), and a checklist of commands you ran (`lint`, `build`, scripts).

## Security & Configuration Tips
Store secrets in `.env.local`; never commit API keys. The site depends on `NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN` and `NEXT_PUBLIC_MICROCMS_API_KEY`, so document any new variables you introduce. Update `next.config.ts` if remote image domains or headers change, and note any microCMS schema updates alongside the corresponding code modifications.

## Agent Tips
- Next.js 15 以降の App Router 動的ルートでは `params` が `Promise` で渡ってくるケースがあるため、`.next/types` の生成結果に合わせて `await params` するかたちで型整合性を保つこと。
- Vercel のビルド成果物サイズが 100MB を超えると汎用的な `An unexpected error happened…` が出るため、`.next/cache` など不要キャッシュは `postbuild` スクリプトで削除しておくと安全。
- 大量の JSON を `console.log` すると Vercel のビルドログが肥大化し、アップロード中に失敗する恐れがあるので、本番ビルド前にデバッグログを外すこと。
- `public/` 配下の静的アセットは空白や記号を含まないシンプルなファイル名に揃えると、Vercel のデプロイ時に扱いやすくトラブルも減らせる。
