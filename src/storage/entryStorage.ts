export type EntryCategory = 'mood' | 'habits' | 'health' | 'productivity' | 'finances'

export interface TrackerEntry {
  id: string
  category: EntryCategory
  value: number
  note: string
  createdAt: string
}

interface NewEntry {
  category: EntryCategory
  value: number
  note: string
}

const STORAGE_KEY = 'private-life-tracker.entries.v1'

const isEntryCategory = (value: unknown): value is EntryCategory =>
  value === 'mood' ||
  value === 'habits' ||
  value === 'health' ||
  value === 'productivity' ||
  value === 'finances'

const isTrackerEntry = (value: unknown): value is TrackerEntry => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<TrackerEntry>
  return (
    typeof candidate.id === 'string' &&
    isEntryCategory(candidate.category) &&
    typeof candidate.value === 'number' &&
    typeof candidate.note === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}

export const readEntries = (): TrackerEntry[] => {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isTrackerEntry)
  } catch {
    return []
  }
}

const writeEntries = (entries: TrackerEntry[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

const createEntryId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const addEntry = (entry: NewEntry): TrackerEntry[] => {
  const nextEntry: TrackerEntry = {
    id: createEntryId(),
    createdAt: new Date().toISOString(),
    category: entry.category,
    value: entry.value,
    note: entry.note,
  }

  const existing = readEntries()
  const next = [nextEntry, ...existing]
  writeEntries(next)
  return next
}

export const clearEntries = () => {
  window.localStorage.removeItem(STORAGE_KEY)
}

export const storageKey = STORAGE_KEY
