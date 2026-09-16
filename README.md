# PrivateLifeTracker

PrivateLifeTracker is now an **Expo + React Native + TypeScript** Android-ready app foundation for a privacy-first personal tracker. It ships with a local-only dashboard, daily entry screen, reusable UI components, and overview analytics. No cloud APIs or third-party data sync are included.

## What is included

- **Expo managed app** ready for Android devices and emulators
- **TypeScript** project setup
- **Privacy-first dashboard** with cards for:
  - Health metrics
  - Mood
  - Productivity
  - Finances
  - Quick stats
- **Daily entry screen** for logging local data
- **Overview analytics** for averages, streaks, and recent entry summaries
- **Secure local storage** using `expo-secure-store` on Android, with web local storage fallback for browser preview only
- **Reusable UI components** for cards, tabs, and tracking inputs

## Privacy model

- Data is stored **only on the local device**
- No cloud sync, backend, or analytics service is configured
- No location, contacts, camera, or other sensitive Android permissions are requested
- Expo Secure Store is used for private on-device persistence in the Android app

## Project structure

```text
/home/runner/work/PrivateLifeTracker/PrivateLifeTracker
├── App.tsx
├── app.json
├── babel.config.js
├── index.js
├── package.json
├── tsconfig.json
├── assets/
└── src/
    ├── components/
    ├── screens/
    ├── storage/
    ├── types/
    └── utils/
```

## Android prerequisites

Install the following before running on Android:

1. **Node.js 20+**
2. **npm 10+**
3. **Android Studio**
   - Install the latest Android SDK
   - Install at least one emulator image
   - Make sure `adb` is available in your shell
4. **Expo Go** on your Android phone for quick preview
   - or use an Android emulator from Android Studio

## Setup

```bash
git clone https://github.com/nirajmallik143-hub/PrivateLifeTracker.git
cd PrivateLifeTracker
npm install
```

## Run on Android

### Option 1: Android emulator

1. Start an Android emulator from Android Studio
2. In the project root run:

```bash
npm run android
```

Expo will start the Metro bundler and open the app in the running emulator.

### Option 2: Physical Android phone with Expo Go

1. Install **Expo Go** from the Play Store
2. Start the app server:

```bash
npm start
```

3. Scan the QR code shown in the terminal or Expo web UI from Expo Go

This is the fastest way to preview the Android UI on your phone.

### Option 3: Development build / preview-ready workflow

If you want a more native-like install path later:

```bash
npx expo prebuild --platform android
```

That generates Android-native project files for further extension or EAS/development build workflows. The current repository stays Expo-managed by default.

## Useful commands

```bash
npm start
npm run android
npm run web
npm run typecheck
```

## Android app metadata

The Expo app configuration includes:

- App name: `PrivateLifeTracker`
- Slug: `private-life-tracker`
- Android package: `com.nirajmallik143.privatelifetracker`
- Portrait orientation
- No extra Android runtime permissions requested

## Current screens

### Dashboard

- Quick stats summary
- Health metrics card
- Mood card
- Productivity card
- Finances card

### Daily Entry

- Form-based tracker inputs for each category
- Secure local save flow

### Overview

- Average mood and sleep
- Focus totals
- Savings totals
- Entry streak summary
- Recent entries list

## Notes

- The app currently uses starter seed data on first launch so the dashboard is immediately usable
- Saving a daily entry replaces the existing entry for that date
- The app is intentionally local-only in this iteration

## License

MIT
