# PrivateLifeTracker

PrivateLifeTracker is a deployment-ready Progressive Web App (PWA) for privacy-first personal tracking.

## What it tracks

- Mood
- Habits
- Health
- Productivity
- Finances

## Privacy model

- Data is stored locally in browser storage (`localStorage`) on your device.
- No analytics, no cloud sync, and no external data sharing is enabled by default.
- If browser/site data is cleared, local app data can be removed.

## Local development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run type-check
npm run test
npm run build
npm run preview
```

`npm run preview` serves the production build locally.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, import the repository.
3. Framework preset: **Vite** (auto-detected).
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

## Deploy to Netlify

1. Push this repository to GitHub.
2. In Netlify, create a new site from Git.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy.

## Use on Redmi 12 (Chrome)

1. Open your deployed app URL in Chrome on the Redmi 12.
2. Verify the app loads and works.
3. Tap Chrome menu (**⋮**) → **Add to Home screen** or **Install app**.
4. Confirm installation.
5. Launch from the home screen for app-like standalone usage.

## Notes for offline/install behavior

- The app includes a web app manifest and service worker caching via `vite-plugin-pwa`.
- After first load, built assets are cached for offline usage.
- Install prompt/availability can vary by Chrome version and engagement heuristics.

## Available scripts

- `npm run dev` — start development server
- `npm run build` — type-check and build production assets
- `npm run preview` — preview production build
- `npm run type-check` — TypeScript checks
- `npm run test` — storage behavior tests (Vitest)

## License

MIT
