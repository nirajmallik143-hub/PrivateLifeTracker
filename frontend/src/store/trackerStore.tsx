import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { DEFAULT_TRACKER_DATA, type CustomMetric, type TrackerData } from '../types.ts'
import * as encryptedStore from '../storage/encryptedStore.ts'

const TRACKER_STORAGE_KEY = 'tracker-data'

export interface TrackerPersistence {
  saveData<T>(key: string, value: T): Promise<void>
  loadData<T>(key: string): Promise<T | null>
}

interface TrackerStoreContextValue {
  data: TrackerData
  saveState: 'idle' | 'saving' | 'saved' | 'error'
  saveMessage: string
  updateData: (updater: (current: TrackerData) => TrackerData) => void
  addCustomMetric: () => void
  updateCustomMetric: (id: string, field: keyof CustomMetric, value: string) => void
  removeCustomMetric: (id: string) => void
}

const TrackerStoreContext = createContext<TrackerStoreContextValue | null>(null)

function createMetric(): CustomMetric {
  return {
    id: globalThis.crypto.randomUUID(),
    label: '',
    value: '',
  }
}

interface TrackerProviderProps extends PropsWithChildren {
  debounceMs?: number
  storage?: TrackerPersistence
}

export function TrackerProvider({
  children,
  debounceMs = 400,
  storage = encryptedStore,
}: TrackerProviderProps) {
  const [data, setData] = useState<TrackerData>(DEFAULT_TRACKER_DATA)
  const [saveState, setSaveState] = useState<
    TrackerStoreContextValue['saveState']
  >('idle')
  const [saveMessage, setSaveMessage] = useState('Encrypted autosave ready')
  const [isReady, setIsReady] = useState(false)
  const [version, setVersion] = useState(0)
  const saveRunRef = useRef(0)

  useEffect(() => {
    let isCancelled = false

    void (async () => {
      try {
        const storedData = await storage.loadData<TrackerData>(TRACKER_STORAGE_KEY)

        if (!isCancelled && storedData) {
          setData(storedData)
          setSaveState('saved')
          setSaveMessage('Encrypted data restored')
        }
      } catch {
        if (!isCancelled) {
          setSaveState('error')
          setSaveMessage(
            'Could not read local encrypted data. New changes stay in memory until the next successful save.',
          )
        }
      } finally {
        if (!isCancelled) {
          setIsReady(true)
        }
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [storage])

  useEffect(() => {
    if (!isReady || version === 0) {
      return undefined
    }

    setSaveState('saving')
    setSaveMessage('Saving...')

    const saveRun = saveRunRef.current + 1
    saveRunRef.current = saveRun

    const timeout = window.setTimeout(() => {
      void (async () => {
        try {
          await storage.saveData(TRACKER_STORAGE_KEY, data)

          if (saveRunRef.current === saveRun) {
            setSaveState('saved')
            setSaveMessage('Saved locally')
          }
        } catch {
          if (saveRunRef.current === saveRun) {
            setSaveState('error')
            setSaveMessage(
              'Autosave failed. Your latest changes are still available in memory.',
            )
          }
        }
      })()
    }, debounceMs)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [data, debounceMs, isReady, storage, version])

  function updateData(updater: (current: TrackerData) => TrackerData) {
    setData((current) => updater(current))
    setVersion((current) => current + 1)
  }

  function addCustomMetric() {
    updateData((current) => ({
      ...current,
      customMetrics: [...current.customMetrics, createMetric()],
    }))
  }

  function updateCustomMetric(
    id: string,
    field: keyof CustomMetric,
    value: string,
  ) {
    updateData((current) => ({
      ...current,
      customMetrics: current.customMetrics.map((metric) =>
        metric.id === id ? { ...metric, [field]: value } : metric,
      ),
    }))
  }

  function removeCustomMetric(id: string) {
    updateData((current) => ({
      ...current,
      customMetrics: current.customMetrics.filter((metric) => metric.id !== id),
    }))
  }

  const value = useMemo<TrackerStoreContextValue>(
    () => ({
      data,
      saveState,
      saveMessage,
      updateData,
      addCustomMetric,
      updateCustomMetric,
      removeCustomMetric,
    }),
    [data, saveMessage, saveState],
  )

  return <TrackerStoreContext.Provider value={value}>{children}</TrackerStoreContext.Provider>
}

export function useTrackerStore() {
  const context = useContext(TrackerStoreContext)

  if (!context) {
    throw new Error('useTrackerStore must be used within a TrackerProvider.')
  }

  return context
}
