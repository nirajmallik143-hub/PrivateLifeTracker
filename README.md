# PrivateLifeTracker

PrivateLifeTracker is now a **minimal, runnable web app** built with **React + TypeScript + Vite** and packaged as an installable **Progressive Web App (PWA)**.

## Current scope

This repository was previously only a skeleton README. The current implementation is intentionally small and honest:

- ✅ Local-only browser storage on the device (`localStorage`)
- ✅ No analytics, cloud sync, or third-party tracking
- ✅ Installable from Chrome on Android as a PWA when served over HTTPS
- ✅ Simple private entry tracking with JSON export
- ❌ No native Android APK
- ❌ No backend or sync service
- ❌ No end-to-end encryption yet

## Tech stack

- React 19
- TypeScript
- Vite
- Static PWA assets: `manifest.webmanifest`, `service-worker.js`, install icons

## Project structure

```text
/home/runner/work/PrivateLifeTracker/PrivateLifeTracker
├── public/
│   ├── manifest.webmanifest
│   ├── service-worker.js
│   └── icons...
├── src/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## Install and run locally

### Prerequisites

- Node.js 20+ recommended
- npm

### Development

```bash
cd /home/runner/work/PrivateLifeTracker/PrivateLifeTracker
npm install
npm run dev
```

### Production build

```bash
cd /home/runner/work/PrivateLifeTracker/PrivateLifeTracker
npm install
npm run build
```

The production files are written to `/home/runner/work/PrivateLifeTracker/PrivateLifeTracker/dist`.

## Redmi 12 installation options

### Option A: Proper installable PWA from Chrome on Android

This is the best option if you do **not** want to depend on a desktop development server while using the app.

1. Build the app:

   ```bash
   cd /home/runner/work/PrivateLifeTracker/PrivateLifeTracker
   npm install
   npm run build
   ```

2. Publish the `dist/` folder to any **static HTTPS host** you control.
   - Examples: your own Nginx/Caddy server, a private static hosting setup, or any HTTPS-only static site host.
   - The app itself is static; user data still stays in the browser on the Redmi 12.

3. On the Redmi 12, open the HTTPS URL in **Chrome**.
4. In Chrome, open the menu and tap **Install app** or **Add to Home screen**.
5. Launch it from the home screen like an app.

### Option B: Same-Wi-Fi local network preview

This is useful for quick testing from your phone, but it still depends on the computer staying on.

```bash
cd /home/runner/work/PrivateLifeTracker/PrivateLifeTracker
npm install
npm run build
npm run preview -- --host 0.0.0.0
```

Then open the shown `http://<your-computer-ip>:4173` address from Chrome on the Redmi 12 while both devices are on the same Wi-Fi network.

> Note: plain HTTP on a LAN is fine for testing the UI, but Android PWA install/offline behavior is most reliable when the app is served over **HTTPS**.

## Privacy notes

- Data is stored in the browser storage of the current device/browser profile.
- No external APIs are used.
- If you clear browser site data or uninstall/reset the browser profile, local entries are removed from that device.
- Export JSON regularly if you want backups.

## Available commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check
```

## Validation used for this implementation

- `npm run type-check`
- `npm run lint`
- `npm run build`
