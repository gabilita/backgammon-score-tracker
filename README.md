# Backgammon Score Tracker

Adobe React Spectrum app to manage players, sessions, and rankings.

## Local development

- Node 20+ required (Vite v5)
- Install deps: `npm install`
- Run dev: `nvm use 20 && npm run dev`

## Build

```
npm run build
```

Outputs to `dist/`.

## Deployment (GitHub Pages)

This repo is configured to auto-deploy to GitHub Pages via GitHub Actions.

- Site URL: `https://gabilita.github.io/backgammon-score-tracker/`
- Vite base path: set in `vite.config.ts` as `base: '/backgammon-score-tracker/'`

### One-time setup

1) Settings → Pages → Build and deployment → Source: “GitHub Actions”
2) Ensure Actions are enabled: Settings → Actions → General → allow all actions

### How it works

- On push to `main`, the workflow `.github/workflows/deploy.yml`:
  - installs deps
  - runs `npm run build`
  - uploads `dist/` and deploys to Pages

### Trigger a deploy manually

- Go to Actions → “Deploy to GitHub Pages” → Run workflow (workflow_dispatch enabled)

### Common 404s on Pages

- Raw source like `/src/main.tsx` will 404. Pages serves the built bundle under `/backgammon-score-tracker/`.
- Use Vite asset imports or relative paths; favicon is `backgammon.svg` in `public/`.
- Header logo imported as `import logoUrl from '/backgammon.svg'` to respect base.

### Check deployment status

- Actions tab: “Deploy to GitHub Pages” run status and logs
- Environments: “github-pages” shows latest deployment and URL
- Settings → Pages shows overall configuration
