import { useEffect, useMemo, useState } from 'react'

type TrackerEntry = {
  id: string
  category: string
  date: string
  note: string
  title: string
  value: string
}

type EntryDraft = Omit<TrackerEntry, 'id'>

const STORAGE_KEY = 'private-life-tracker.entries.v1'
const categoryOptions = ['Health', 'Productivity', 'Finances', 'Mood', 'Fitness', 'Custom'] as const

const createDefaultDraft = (): EntryDraft => ({
  category: categoryOptions[0],
  date: new Date().toISOString().slice(0, 10),
  note: '',
  title: '',
  value: '',
})

const loadEntries = (): TrackerEntry[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.flatMap((entry) => {
      if (
        typeof entry === 'object' &&
        entry !== null &&
        typeof entry.id === 'string' &&
        typeof entry.category === 'string' &&
        typeof entry.date === 'string' &&
        typeof entry.note === 'string' &&
        typeof entry.title === 'string' &&
        typeof entry.value === 'string'
      ) {
        return [entry]
      }

      return []
    })
  } catch {
    return []
  }
}

const createEntryId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const downloadEntries = (entries: TrackerEntry[]) => {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `private-life-tracker-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function App() {
  const [draft, setDraft] = useState<EntryDraft>(createDefaultDraft)
  const [entries, setEntries] = useState<TrackerEntry[]>(loadEntries)
  const [statusMessage, setStatusMessage] = useState('Stored locally on this device only.')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const orderedEntries = useMemo(
    () => [...entries].sort((left, right) => right.date.localeCompare(left.date)),
    [entries],
  )

  const updateDraft = (field: keyof EntryDraft, value: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const sanitizedTitle = draft.title.trim()
    const sanitizedNote = draft.note.trim()
    const sanitizedValue = draft.value.trim()

    if (!sanitizedTitle && !sanitizedNote && !sanitizedValue) {
      setStatusMessage('Add a title, note, or value before saving.')
      return
    }

    setEntries((currentEntries) => [
      {
        ...draft,
        id: createEntryId(),
        note: sanitizedNote,
        title: sanitizedTitle,
        value: sanitizedValue,
      },
      ...currentEntries,
    ])
    setDraft(createDefaultDraft())
    setStatusMessage('Entry saved locally on this device.')
  }

  const handleClear = () => {
    const shouldClear = window.confirm('Delete all saved entries from this browser on this device?')
    if (!shouldClear) {
      return
    }

    setEntries([])
    setStatusMessage('All local entries were removed from this browser.')
  }

  return (
    <main className="app-shell">
      <section className="hero card">
        <p className="eyebrow">Private • Local-only • Installable on Android</p>
        <h1>PrivateLifeTracker</h1>
        <p className="hero-copy">
          A minimal tracker shell that keeps entries in your browser storage on this device.
          No analytics, no cloud sync, and no third-party services are used.
        </p>
        <div className="hero-actions">
          <span className="pill">Chrome → menu → Install app</span>
          <span className="pill">Works well on Redmi 12-sized screens</span>
        </div>
      </section>

      <section className="grid-layout">
        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="section-heading">
            <h2>New entry</h2>
            <p>{statusMessage}</p>
          </div>

          <label>
            <span>Date</span>
            <input
              type="date"
              value={draft.date}
              onChange={(event) => updateDraft('date', event.target.value)}
            />
          </label>

          <label>
            <span>Category</span>
            <select
              value={draft.category}
              onChange={(event) => updateDraft('category', event.target.value)}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Title</span>
            <input
              type="text"
              inputMode="text"
              placeholder="Example: Evening walk"
              value={draft.title}
              onChange={(event) => updateDraft('title', event.target.value)}
            />
          </label>

          <label>
            <span>Value</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Example: 7,500 steps"
              value={draft.value}
              onChange={(event) => updateDraft('value', event.target.value)}
            />
          </label>

          <label>
            <span>Note</span>
            <textarea
              rows={4}
              placeholder="Short private note stored on this device"
              value={draft.note}
              onChange={(event) => updateDraft('note', event.target.value)}
            />
          </label>

          <button type="submit">Save locally</button>
        </form>

        <section className="card data-card">
          <div className="section-heading">
            <h2>Your entries</h2>
            <p>{entries.length} saved</p>
          </div>

          <div className="tool-row">
            <button type="button" className="secondary-button" onClick={() => downloadEntries(entries)}>
              Export JSON
            </button>
            <button type="button" className="secondary-button danger-button" onClick={handleClear}>
              Clear local data
            </button>
          </div>

          {orderedEntries.length === 0 ? (
            <div className="empty-state">
              <p>No entries yet.</p>
              <p>Add your first item to confirm the app works on your phone.</p>
            </div>
          ) : (
            <ul className="entry-list">
              {orderedEntries.map((entry) => (
                <li key={entry.id} className="entry-item">
                  <div className="entry-meta">
                    <span>{entry.category}</span>
                    <span>{entry.date}</span>
                  </div>
                  <h3>{entry.title || 'Untitled entry'}</h3>
                  {entry.value ? <p className="entry-value">{entry.value}</p> : null}
                  {entry.note ? <p>{entry.note}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
