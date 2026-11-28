# PrivateLifeTracker

PrivateLifeTracker includes a React tracker with encrypted local autosave and a separate static progressive web app starter that can be installed on an Android home screen.

## What is included

- A React tracker with local encrypted autosave
- A mobile-friendly landing page
- A simple local-only note field stored in browser storage
- A web app manifest for install prompts
- A service worker for offline app-shell caching
- A GitHub Pages workflow for publishing the root site

## Project structure

```text
PrivateLifeTracker/
├── .github/workflows/deploy-pages.yml
├── assets/icon.svg
├── docs/
├── encryption/
├── frontend/
├── index.html
├── manifest.webmanifest
├── script.js
├── styles.css
└── sw.js
```

## Run the static starter locally

Any static file server works. For example, from the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Run the React tracker locally

Node.js 22.12+ (or 24.x / 26.x+) and npm are required.

```bash
npm install
npm run dev
npm run build
```

Run `npm run test`, `npm run lint`, and `npm run type-check` during development.

### Autosave and privacy

Tracker changes are saved after a 400ms debounce. The tracker encrypts its data with AES-256-GCM before writing it to IndexedDB and displays a save status. The device key is stored in the same browser profile, so this does not protect against a full compromise of that profile. Back up your device for disaster recovery beyond local autosave.

See [Security Architecture](./docs/SECURITY.md) and [Encryption Details](./docs/ENCRYPTION.md).

## Deploy on GitHub Pages

After this branch is merged to `main`, GitHub Actions can publish the site with the included workflow.

Expected Pages URL:

```text
https://nirajmallik143-hub.github.io/PrivateLifeTracker/
```

If GitHub Pages is not already enabled for the repository:

1. Open the repository on GitHub
2. Go to **Settings** → **Pages**
3. Set the source to **GitHub Actions**

## Install on Android

1. Open the live site in Chrome
2. Tap the browser menu
3. Tap **Install app** or **Add to Home screen**
4. Confirm the prompt

## Notes

- The static starter's note is stored unencrypted in the current browser on the current device; it is separate from the React tracker and its encrypted autosave.
- The Pages workflow publishes the root static starter, not the React tracker.
- There is no backend in this repository snapshot
- The sample note field is only a placeholder for future tracker features

## License

MIT
