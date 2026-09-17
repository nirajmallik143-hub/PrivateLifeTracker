export interface EncryptedPayload {
  algorithm: 'AES-256-GCM'
  iv: string
  ciphertext: string
}

export interface KeyStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const DEVICE_KEY_STORAGE_KEY = 'private-life-tracker.device-key'

function getGlobalCrypto(): Crypto {
  return globalThis.crypto
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.length)

  new Uint8Array(buffer).set(bytes)

  return buffer
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = ''

  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }

  return btoa(binary)
}

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function getDefaultKeyStorage(): KeyStorage {
  return window.localStorage
}

async function getOrCreateKey(
  storage: KeyStorage = getDefaultKeyStorage(),
): Promise<CryptoKey> {
  let encodedKey = storage.getItem(DEVICE_KEY_STORAGE_KEY)

  if (!encodedKey) {
    const keyBytes = new Uint8Array(32)

    getGlobalCrypto().getRandomValues(keyBytes)
    encodedKey = encodeBase64(keyBytes)
    storage.setItem(DEVICE_KEY_STORAGE_KEY, encodedKey)
  }

  return getGlobalCrypto().subtle.importKey(
    'raw',
    toArrayBuffer(decodeBase64(encodedKey)),
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptData<T>(
  value: T,
  storage: KeyStorage = getDefaultKeyStorage(),
): Promise<EncryptedPayload> {
  const key = await getOrCreateKey(storage)
  const iv = new Uint8Array(12)

  getGlobalCrypto().getRandomValues(iv)

  const encodedValue = new TextEncoder().encode(JSON.stringify(value))
  const encrypted = await getGlobalCrypto().subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedValue,
  )

  return {
    algorithm: 'AES-256-GCM',
    iv: encodeBase64(iv),
    ciphertext: encodeBase64(new Uint8Array(encrypted)),
  }
}

export async function decryptData<T>(
  payload: EncryptedPayload,
  storage: KeyStorage = getDefaultKeyStorage(),
): Promise<T> {
  const key = await getOrCreateKey(storage)
  const decrypted = await getGlobalCrypto().subtle.decrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(decodeBase64(payload.iv)) },
    key,
    toArrayBuffer(decodeBase64(payload.ciphertext)),
  )

  return JSON.parse(new TextDecoder().decode(decrypted)) as T
}
