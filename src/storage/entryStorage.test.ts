import { beforeEach, describe, expect, it } from 'vitest'
import { addEntry, clearEntries, readEntries, storageKey } from './entryStorage'

describe('entryStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('stores and reads entries locally', () => {
    const afterSave = addEntry({
      category: 'mood',
      value: 8,
      note: 'Good day',
    })

    expect(afterSave).toHaveLength(1)
    const saved = readEntries()
    expect(saved).toHaveLength(1)
    expect(saved[0]).toMatchObject({
      category: 'mood',
      value: 8,
      note: 'Good day',
    })
    expect(typeof saved[0].id).toBe('string')
  })

  it('clears all saved entries', () => {
    addEntry({ category: 'health', value: 3, note: '' })
    expect(readEntries()).toHaveLength(1)

    clearEntries()

    expect(readEntries()).toEqual([])
    expect(window.localStorage.getItem(storageKey)).toBeNull()
  })
})
