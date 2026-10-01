# PrivateLifeTracker

PrivateLifeTracker is now a small static progressive web app starter that can be opened in a browser and installed on an Android home screen.

## What is included

- A mobile-friendly landing page
- A simple local-only note field stored in browser storage
- A web app manifest for install prompts
- A service worker for offline app-shell caching
- A GitHub Pages workflow for publishing the root site

## Project structure

```text
/home/runner/work/PrivateLifeTracker/PrivateLifeTracker/
├── .github/workflows/deploy-pages.yml
├── assets/icon.svg
├── index.html
├── manifest.webmanifest
├── script.js
├── styles.css
└── sw.js
```

## Run locally

Any static file server works. For example:

```bash
cd /home/runner/work/PrivateLifeTracker/PrivateLifeTracker
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

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

To let the workflow enable Pages automatically, add a repository secret named
`PAGES_TOKEN` containing a personal access token with repository access or
Pages write permission. Without this secret, enable Pages manually first.

## Install on Android

1. Open the live site in Chrome
2. Tap the browser menu
3. Tap **Install app** or **Add to Home screen**
4. Confirm the prompt

## Notes

- Data in this starter is stored only in the current browser on the current device
- There is no backend in this repository snapshot
- The sample note field is only a placeholder for future tracker features

## License

MIT
