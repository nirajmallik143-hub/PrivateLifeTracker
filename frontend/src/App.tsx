import './App.css'
import { useTrackerStore } from './store/trackerStore.tsx'

function App() {
  const {
    data,
    saveState,
    saveMessage,
    updateData,
    addCustomMetric,
    updateCustomMetric,
    removeCustomMetric,
  } = useTrackerStore()

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Encrypted local autosave</p>
          <h1>PrivateLifeTracker</h1>
          <p className="lead">
            Every change is encrypted with AES-256 before it is written to local
            IndexedDB storage.
          </p>
        </div>
        <div
          aria-live="polite"
          className={`save-indicator save-indicator--${saveState}`}
          data-testid="save-indicator"
        >
          <span className="save-indicator__dot" />
          {saveMessage}
        </div>
      </header>

      <section className="grid">
        <article className="panel">
          <h2>Health</h2>
          <label>
            Steps
            <input
              value={data.health.steps}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  health: { ...current.health, steps: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Sleep hours
            <input
              value={data.health.sleepHours}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  health: { ...current.health, sleepHours: event.target.value },
                }))
              }
            />
          </label>
        </article>

        <article className="panel">
          <h2>Productivity</h2>
          <label>
            Focus minutes
            <input
              value={data.productivity.focusMinutes}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  productivity: {
                    ...current.productivity,
                    focusMinutes: event.target.value,
                  },
                }))
              }
            />
          </label>
          <label>
            Top task
            <input
              value={data.productivity.topTask}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  productivity: {
                    ...current.productivity,
                    topTask: event.target.value,
                  },
                }))
              }
            />
          </label>
        </article>

        <article className="panel">
          <h2>Finances</h2>
          <label>
            Monthly budget
            <input
              value={data.finances.monthlyBudget}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  finances: {
                    ...current.finances,
                    monthlyBudget: event.target.value,
                  },
                }))
              }
            />
          </label>
          <label>
            Latest expense
            <input
              value={data.finances.latestExpense}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  finances: {
                    ...current.finances,
                    latestExpense: event.target.value,
                  },
                }))
              }
            />
          </label>
        </article>

        <article className="panel">
          <h2>Mood & mental health</h2>
          <label>
            Daily mood
            <input
              aria-label="Daily mood"
              value={data.mood.today}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  mood: { ...current.mood, today: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Reflection note
            <textarea
              value={data.mood.note}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  mood: { ...current.mood, note: event.target.value },
                }))
              }
            />
          </label>
        </article>

        <article className="panel">
          <h2>Fitness</h2>
          <label>
            Workout
            <input
              value={data.fitness.workout}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  fitness: { ...current.fitness, workout: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Progress note
            <textarea
              value={data.fitness.progressNote}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  fitness: {
                    ...current.fitness,
                    progressNote: event.target.value,
                  },
                }))
              }
            />
          </label>
        </article>

        <article className="panel">
          <h2>Settings</h2>
          <label>
            Profile name
            <input
              value={data.settings.profileName}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  settings: {
                    ...current.settings,
                    profileName: event.target.value,
                  },
                }))
              }
            />
          </label>
          <label>
            Preferred currency
            <input
              value={data.settings.currency}
              onChange={(event) =>
                updateData((current) => ({
                  ...current,
                  settings: {
                    ...current.settings,
                    currency: event.target.value,
                  },
                }))
              }
            />
          </label>
        </article>
      </section>

      <section className="panel custom-metrics">
        <div className="custom-metrics__header">
          <div>
            <h2>Custom metrics</h2>
            <p>Add or remove your own encrypted metrics.</p>
          </div>
          <button type="button" onClick={() => addCustomMetric()}>
            Add metric
          </button>
        </div>
        <div className="custom-metrics__list">
          {data.customMetrics.map((metric) => (
            <div className="metric-row" key={metric.id}>
              <label>
                Label
                <input
                  value={metric.label}
                  onChange={(event) =>
                    updateCustomMetric(metric.id, 'label', event.target.value)
                  }
                />
              </label>
              <label>
                Value
                <input
                  value={metric.value}
                  onChange={(event) =>
                    updateCustomMetric(metric.id, 'value', event.target.value)
                  }
                />
              </label>
              <button type="button" onClick={() => removeCustomMetric(metric.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
