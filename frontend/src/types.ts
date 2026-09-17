export interface CustomMetric {
  id: string
  label: string
  value: string
}

export interface TrackerData {
  health: {
    steps: string
    sleepHours: string
  }
  productivity: {
    focusMinutes: string
    topTask: string
  }
  finances: {
    monthlyBudget: string
    latestExpense: string
  }
  mood: {
    today: string
    note: string
  }
  fitness: {
    workout: string
    progressNote: string
  }
  customMetrics: CustomMetric[]
  settings: {
    profileName: string
    currency: string
  }
}

export const DEFAULT_TRACKER_DATA: TrackerData = {
  health: {
    steps: '',
    sleepHours: '',
  },
  productivity: {
    focusMinutes: '',
    topTask: '',
  },
  finances: {
    monthlyBudget: '',
    latestExpense: '',
  },
  mood: {
    today: '',
    note: '',
  },
  fitness: {
    workout: '',
    progressNote: '',
  },
  customMetrics: [],
  settings: {
    profileName: 'Private profile',
    currency: 'USD',
  },
}
