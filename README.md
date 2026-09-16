# PrivateLifeTracker

PrivateLifeTracker is a privacy-first, local-only personal tracker that now ships as an installable Progressive Web App (PWA). You can run it yourself, keep it offline after the first load, and install it on a modern Android phone or on iPhone/iPad without creating an account or sending data to a cloud service.

## Privacy-first design

- No accounts, analytics, ads, or third-party scripts.
- No backend is required.
- Entries are stored in browser storage on the device.
- The service worker caches only the app shell for offline use.
- Import/export stays in JSON files that you control.

## What is included

- Installable PWA manifest and mobile-friendly metadata
- Offline service worker for the local app shell
- Android launcher icons and iOS home-screen icon
- Local entry tracking with export/import and delete controls
- Zero-dependency build, preview, and test scripts

## Project structure

```
PrivateLifeTracker/
├── app.js
├── assets/
├── index.html
├── manifest.webmanifest
├── scripts/
├── styles.css
├── sw.js
└── tests/
```

## Local development

### Prerequisites

- Node.js 18+

### Start the local development server

```bash
npm run dev
```

Then open `http://127.0.0.1:4173` in a browser.

Notes:
- Service workers work on `localhost`/`127.0.0.1` during development.
- Data is stored in that browser profile only.

## Automated checks

Run the installability and configuration checks:

```bash
npm test
```

## Production build

Create the static production bundle:

```bash
npm run build
```

This writes the deployable site into `dist/`.

### Preview the production build locally

```bash
npm run preview
```

Then open `http://127.0.0.1:4173`.

## Production deployment

Deploy the contents of `dist/` to any HTTPS static host that you control, for example:

- your own Nginx/Caddy server
- a private NAS/home server with HTTPS enabled
- any static hosting setup you trust and control

Deployment requirements:

- Serve over **HTTPS** for real phone installability and offline support.
- Keep all files on the same origin.
- Do not add third-party analytics or remote scripts if you want to preserve the privacy guarantees.

## Install on your phone

### Android (Chrome, Edge, Samsung Internet)

1. Open the deployed HTTPS site on your phone.
2. Wait for the first page load to complete.
3. Tap the in-app **Install app** button if shown, or use the browser menu and choose **Install app** / **Add to Home screen**.
4. Launch PrivateLifeTracker from your home screen.

### iPhone / iPad (Safari)

1. Open the deployed HTTPS site in Safari.
2. Tap the **Share** button.
3. Choose **Add to Home Screen**.
4. Confirm the name and tap **Add**.
5. Launch PrivateLifeTracker from your home screen.

## Data handling details

- Clearing browser data or uninstalling the PWA may remove locally stored entries.
- Export a JSON backup before changing devices or resetting your browser.
- Imported backups replace the current in-browser data for this app.

## Available scripts

```bash
npm run dev      # serve the source app locally
npm run test     # verify PWA metadata and offline shell configuration
npm run build    # create dist/
npm run preview  # serve dist/ locally
```

## License

MIT
