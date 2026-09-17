import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import App from '@app/App'
import { TrackerProvider, type TrackerPersistence } from '@app/store/trackerStore'
import { DEFAULT_TRACKER_DATA } from '@app/types'

describe('autosave integration', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test('data changes trigger a save within the debounce window', async () => {
    vi.useFakeTimers()

    const saveData = vi.fn().mockResolvedValue(undefined)
    const loadData = vi.fn().mockResolvedValue(null)
    const storage: TrackerPersistence = {
      saveData,
      loadData,
    }

    render(
      <TrackerProvider debounceMs={400} storage={storage}>
        <App />
      </TrackerProvider>,
    )

    await act(async () => {
      await Promise.resolve()
    })

    const moodInput = screen.getByLabelText('Daily mood')

    act(() => {
      fireEvent.change(moodInput, { target: { value: 'Focused' } })
    })

    expect(saveData).not.toHaveBeenCalled()
    expect(screen.getByTestId('save-indicator').textContent).toContain('Saving...')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(399)
    })
    expect(saveData).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
      await Promise.resolve()
    })

    expect(saveData).toHaveBeenCalledWith(
      'tracker-data',
      expect.objectContaining({
        mood: expect.objectContaining({ today: 'Focused' }),
      }),
    )

    expect(screen.getByTestId('save-indicator').textContent).toContain('Saved locally')
  })

  test('restored encrypted data is shown on load', async () => {
    const storage: TrackerPersistence = {
      saveData: vi.fn().mockResolvedValue(undefined),
      loadData: vi.fn().mockResolvedValue({
        ...DEFAULT_TRACKER_DATA,
        settings: {
          ...DEFAULT_TRACKER_DATA.settings,
          profileName: 'Restored Profile',
        },
      }),
    }

    render(
      <TrackerProvider storage={storage}>
        <App />
      </TrackerProvider>,
    )

    await waitFor(() => {
      const profileNameInput = screen.getByDisplayValue('Restored Profile')

      expect(profileNameInput).toBeTruthy()
    })
  })
})
