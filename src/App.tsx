import { useMemo, useState, type FormEvent } from 'react'
import './App.css'
import {
  addEntry,
  clearEntries,
  readEntries,
  type EntryCategory,
  type TrackerEntry,
} from './storage/entryStorage'

const categories: EntryCategory[] = [
  'mood',
  'habits',
  'health',
  'productivity',
  'finances',
]

type EntryFormState = {
  category: EntryCategory
  value: string
  note: string
}

const initialForm: EntryFormState = {
  category: 'mood',
  value: '',
  note: '',
}

function App() {
  const [entries, setEntries] = useState<TrackerEntry[]>(() => readEntries())
  const [form, setForm] = useState<EntryFormState>(initialForm)
  const [error, setError] = useState('')

  const categoryCounts = useMemo(() => {
    const counts: Record<EntryCategory, number> = {
      mood: 0,
      habits: 0,
      health: 0,
      productivity: 0,
      finances: 0,
    }

    for (const entry of entries) {
      counts[entry.category] += 1
    }

    return counts
  }, [entries])

  const moodAverage = useMemo(() => {
    const moodEntries = entries.filter((entry) => entry.category === 'mood')
    if (moodEntries.length === 0) {
      return null
    }

    const sum = moodEntries.reduce((total, entry) => total + entry.value, 0)
    return (sum / moodEntries.length).toFixed(1)
  }, [entries])

  const todayEntries = useMemo(() => {
    const today = new Date().toDateString()
    return entries.filter((entry) => new Date(entry.createdAt).toDateString() === today)
      .length
  }, [entries])

  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1)

  const submitEntry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const numericValue = Number(form.value)
    if (!Number.isFinite(numericValue)) {
      setError('Please enter a valid number.')
      return
    }

    if (numericValue < 0) {
      setError('Value must be 0 or greater.')
      return
    }

    const next = addEntry({
      category: form.category,
      value: numericValue,
      note: form.note.trim(),
    })

    setEntries(next)
    setForm(initialForm)
    setError('')
  }

  const clearAllData = () => {
    if (!window.confirm('Clear all local tracking data on this device?')) {
      return
    }

    clearEntries()
    setEntries([])
  }

  return (
    <main className="app-shell">
      <header className="panel hero-panel">
        <h1>PrivateLifeTracker</h1>
        <p className="subtle">
          Privacy-first tracker for daily life. Data is saved only in this browser on this
          device.
        </p>
      </header>

      <section className="panel summary-panel" aria-label="Dashboard summary">
        <h2>Dashboard</h2>
        <div className="summary-grid">
          <article className="card">
            <h3>Total entries</h3>
            <p className="big-number">{entries.length}</p>
          </article>
          <article className="card">
            <h3>Today</h3>
            <p className="big-number">{todayEntries}</p>
          </article>
          <article className="card">
            <h3>Average mood</h3>
            <p className="big-number">{moodAverage ?? '—'}</p>
          </article>
        </div>

        <div className="category-summary" aria-label="Category breakdown">
          {categories.map((category) => {
            const count = categoryCounts[category]
            const width = `${Math.max((count / maxCategoryCount) * 100, count > 0 ? 12 : 0)}%`

            return (
              <div key={category} className="bar-row">
                <div className="bar-header">
                  <span>{category}</span>
                  <strong>{count}</strong>
                </div>
                <div className="bar-track" role="presentation">
                  <div className="bar-fill" style={{ width }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel" aria-label="Add entry">
        <h2>Add Entry</h2>
        <form className="entry-form" onSubmit={submitEntry}>
          <label>
            Category
            <select
              value={form.category}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, category: event.target.value as EntryCategory }))
              }
            >
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            Value
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              placeholder="e.g. 8"
              value={form.value}
              onChange={(event) => setForm((prev) => ({ ...prev, value: event.target.value }))}
              required
            />
          </label>

          <label>
            Note
            <textarea
              rows={3}
              placeholder="Optional note"
              value={form.note}
              onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
            />
          </label>

          {error ? <p className="error">{error}</p> : null}
          <button type="submit">Save entry locally</button>
        </form>
      </section>

      <section className="panel" aria-label="History">
        <h2>History</h2>
        {entries.length === 0 ? (
          <p className="subtle">No entries yet. Add one to start tracking.</p>
        ) : (
          <ul className="history-list">
            {entries.map((entry) => (
              <li key={entry.id}>
                <div className="row-top">
                  <span className="pill">{entry.category}</span>
                  <span>{entry.value}</span>
                </div>
                {entry.note ? <p>{entry.note}</p> : null}
                <time dateTime={entry.createdAt}>
                  {new Date(entry.createdAt).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel privacy-panel" aria-label="Privacy">
        <h2>Privacy</h2>
        <p>
          Your records stay in browser storage on this device. No cloud sync, analytics, or
          external data sharing is enabled by default.
        </p>
        <p className="subtle">
          Clearing browser/site data or uninstalling the app may remove saved records.
        </p>
        <button type="button" className="danger" onClick={clearAllData}>
          Clear all local data
        </button>
      </section>
    </main>
  )
}

export default App
