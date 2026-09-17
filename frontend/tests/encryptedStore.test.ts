import { DEFAULT_TRACKER_DATA } from '@app/types'
import {
  loadData,
  loadRawRecord,
  saveData,
} from '@app/storage/encryptedStore'

async function resetDatabase(): Promise<void> {
  localStorage.clear()

  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('private-life-tracker')

    request.addEventListener('error', () => {
      reject(request.error ?? new Error('Unable to clear IndexedDB between tests.'))
    })

    request.addEventListener('success', () => {
      resolve()
    })
  })
}

describe('encrypted store', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  test('saved data is encrypted before it is written to IndexedDB', async () => {
    const trackerData = {
      ...DEFAULT_TRACKER_DATA,
      finances: {
        ...DEFAULT_TRACKER_DATA.finances,
        latestExpense: 'Rent payment',
      },
    }

    await saveData('tracker-data', trackerData)

    const rawRecord = await loadRawRecord('tracker-data')

    expect(rawRecord).toBeDefined()
    expect(JSON.stringify(rawRecord)).not.toContain('Rent payment')
    expect(rawRecord?.payload.algorithm).toBe('AES-256-GCM')
    expect(rawRecord?.payload.ciphertext.length).toBeGreaterThan(0)
  })

  test('saved data can be decrypted and restored correctly', async () => {
    const trackerData = {
      ...DEFAULT_TRACKER_DATA,
      mood: {
        today: 'Calm',
        note: 'Autosave should restore this note',
      },
    }

    await saveData('tracker-data', trackerData)

    const restoredData = await loadData<typeof trackerData>('tracker-data')

    expect(restoredData).toEqual(trackerData)
  })
})
