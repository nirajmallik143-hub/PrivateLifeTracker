import { decryptData, encryptData, type EncryptedPayload } from '@encryption/aes256'

const DATABASE_NAME = 'private-life-tracker'
const STORE_NAME = 'encrypted-tracker-data'

export interface PersistedRecord {
  key: string
  payload: EncryptedPayload
  updatedAt: string
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1)

    request.addEventListener('error', () => {
      reject(request.error ?? new Error('Unable to open local storage.'))
    })

    request.addEventListener('upgradeneeded', () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    })

    request.addEventListener('success', () => {
      resolve(request.result)
    })
  })
}

async function runTransaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode)
    let isClosed = false
    let didSettle = false
    let result: T | undefined

    function closeDatabase() {
      if (!isClosed) {
        isClosed = true
        database.close()
      }
    }

    function rejectOnce(error: Error) {
      if (!didSettle) {
        didSettle = true
        closeDatabase()
        reject(error)
      }
    }

    let request: IDBRequest<T>

    try {
      request = operation(transaction.objectStore(STORE_NAME))
    } catch (error) {
      rejectOnce(
        error instanceof Error ? error : new Error('Local storage request failed.'),
      )
      return
    }

    request.addEventListener('error', () => {
      rejectOnce(request.error ?? new Error('Local storage request failed.'))
    })

    request.addEventListener('success', () => {
      result = request.result
    })

    transaction.addEventListener('complete', () => {
      if (!didSettle) {
        didSettle = true
        closeDatabase()
        resolve(result as T)
      }
    })

    transaction.addEventListener('error', () => {
      rejectOnce(transaction.error ?? new Error('Local storage transaction failed.'))
    })

    transaction.addEventListener('abort', () => {
      rejectOnce(transaction.error ?? new Error('Local storage transaction was aborted.'))
    })
  })
}

export async function saveData<T>(key: string, value: T): Promise<void> {
  const payload = await encryptData(value)
  const record: PersistedRecord = {
    key,
    payload,
    updatedAt: new Date().toISOString(),
  }

  await runTransaction('readwrite', (store) => store.put(record))
}

export async function loadData<T>(key: string): Promise<T | null> {
  const record = await runTransaction<PersistedRecord | undefined>('readonly', (store) =>
    store.get(key),
  )

  if (!record) {
    return null
  }

  return decryptData<T>(record.payload)
}

export async function loadRawRecord(
  key: string,
): Promise<PersistedRecord | undefined> {
  return runTransaction<PersistedRecord | undefined>('readonly', (store) =>
    store.get(key),
  )
}
