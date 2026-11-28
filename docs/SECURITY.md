# Security Architecture

PrivateLifeTracker keeps tracker data on the local device and now persists it automatically.

## Local autosave protections

- Tracker state is encrypted before every IndexedDB write, so browser storage does not keep tracker entries as plaintext JSON.
- Autosave is debounced to reduce unnecessary write volume while typing.
- Save failures surface a non-blocking UI message so the user keeps their in-memory changes.
- No external APIs or network persistence are required for autosave.

## Operational note

Automatic local persistence reduces the chance of losing changes during normal use, but external backups are still recommended for device loss, browser profile corruption, or manual data recovery needs. The current device key is stored in the same browser profile (`localStorage`) as the app, so this design protects against casual plaintext exposure in storage rather than a full compromise of the local browser profile.
