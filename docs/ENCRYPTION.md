# Encryption Details

PrivateLifeTracker encrypts tracker data before it is persisted locally.

## Autosave flow

1. React state changes in the tracker store.
2. A debounced autosave waits 400ms after the latest change.
3. The current tracker snapshot is encrypted with AES-256-GCM in `encryption/aes256.ts`.
4. The encrypted payload is written asynchronously to IndexedDB.
5. On startup, the encrypted record is loaded from IndexedDB and decrypted back into memory.

## Stored format

- Encryption algorithm: AES-256-GCM
- IV: random 96-bit value per save
- Ciphertext: base64-encoded encrypted JSON payload
- Persistence target: IndexedDB

The raw IndexedDB record never stores the tracker payload as plaintext JSON.
