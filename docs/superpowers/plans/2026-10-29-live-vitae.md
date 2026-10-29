# Live Vitae Implementation Plan

> **For agentic workers:** Execute inline, task by task; preserve the source homepage and do not copy credentials or personal assets.

**Goal:** Publish a reusable bilingual academic homepage template and a fictional example at the repository's GitHub Pages URL.

**Architecture:** Keep the existing Astro components and data-driven archives. Centralize deployment/editor settings in `site.config.mjs`, derive identity from `profile.json`, and route every local URL through a base-path helper. The default example is explicitly fictional and cannot initialize the owner's editor.

**Tech Stack:** Astro, TypeScript, JSON, Node's built-in test runner, GitHub Actions/Pages.

---

### Task 1: Deployment configuration and routing
- [x] Add `tests/config.test.mjs` for root/project Pages, custom domains, environment overrides and internal/external URLs; run `node --test` before implementation.
- [x] Implement `site.config.mjs`, `src/lib/site.ts`, and update `astro.config.mjs`; rerun tests.
- [x] Replace hardcoded identity, metadata and local URLs in layouts, components, pages and editor.

### Task 2: Safe example content
- [x] Replace `src/data/profile.json`, `publications.json`, `citations.json`; extend `sections.json` with a monographs collection as requested.
- [x] Source Paimon artwork, record provenance and license exceptions in `THIRD_PARTY_NOTICES.md`, and provide an HTML CV; include no original owner's photos, PDFs or vault.
- [x] Default to demo mode and prevent editor authentication/network initialization. User requested an immersive page without disclaimers; documentation records demo provenance instead.
- [x] Parameterize optional Stars/Scholar scripts; skip unconfigured/demo updates without altering data.

### Task 3: Documentation and deployment
- [x] Write `README.md` and `docs/customization.md` with commands, configuration, JSON examples, custom-domain instructions and editor security limitations.
- [x] Configure `.github/workflows/deploy.yml` for repository-aware Pages paths and add pull-request CI.
- [x] Run `npm ci`, `npm test`, `npm run build`; validate generated local links at both root/project paths and scan for original personal identifiers/vaults.
- [x] Check browser layout at 390/807/1600px, language switching, filters (5/3/4/1), deep-link dialogs, and demo editor. Preserve structural labels and per-page layouts per user clarification.
- [x] Commit and push to the requested repository; enable Pages/template settings; verify the deployed example.

## Verification outcome

- 12 Node tests passed; Astro check: zero errors, warnings, or hints.
- Root and project-path builds each validated 156 internal URLs.
- Browser checks confirmed separate archive layouts, visible navigation at 390/807/1600px, language switching, deep-linked publication dialogs and filter counts.
- GitHub CI and Pages deployment succeeded for `286f7b3`.
- Homepage, all seven archives, editor route, portrait and robots.txt returned HTTP 200 on the deployed site.
- Repository marked as a template; Pages uses the GitHub Actions source.
