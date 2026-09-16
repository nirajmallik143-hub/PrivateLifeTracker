import type { DailyEntry, EntryFormState } from '../types/tracker';

export function createSeedEntries(): DailyEntry[] {
  return [0, 1, 2].map((offset) => {
    const date = addDays(new Date(), -offset);

    return {
      id: formatDateKey(date),
      date: formatDateKey(date),
      health: {
        steps: 7200 + offset * 650,
        sleepHours: Number((7.4 - offset * 0.2).toFixed(1)),
        waterGlasses: 8 - offset,
        weightKg: Number((68.4 + offset * 0.1).toFixed(1)),
      },
      mood: {
        moodScore: 8 - offset,
        energyLevel: 7 - offset,
        stressLevel: 4 + offset,
        note: offset === 0 ? 'Focused, private, and balanced.' : 'Steady progress with room to improve.',
      },
      productivity: {
        focusMinutes: 110 - offset * 15,
        tasksCompleted: 6 - offset,
        habitScore: 8 - offset,
      },
      finances: {
        income: 120 + offset * 15,
        expenses: 52 + offset * 9,
        savings: 68 + offset * 6,
      },
    };
  });
}

export function toEntryFormState(entry?: DailyEntry): EntryFormState {
  const fallbackDate = formatDateKey(new Date());

  return {
    date: entry?.date ?? fallbackDate,
    health: {
      steps: String(entry?.health.steps ?? 8000),
      sleepHours: String(entry?.health.sleepHours ?? 7.5),
      waterGlasses: String(entry?.health.waterGlasses ?? 8),
      weightKg: String(entry?.health.weightKg ?? 68),
    },
    mood: {
      moodScore: String(entry?.mood.moodScore ?? 8),
      energyLevel: String(entry?.mood.energyLevel ?? 7),
      stressLevel: String(entry?.mood.stressLevel ?? 4),
      note: entry?.mood.note ?? '',
    },
    productivity: {
      focusMinutes: String(entry?.productivity.focusMinutes ?? 120),
      tasksCompleted: String(entry?.productivity.tasksCompleted ?? 5),
      habitScore: String(entry?.productivity.habitScore ?? 7),
    },
    finances: {
      income: String(entry?.finances.income ?? 0),
      expenses: String(entry?.finances.expenses ?? 0),
      savings: String(entry?.finances.savings ?? 0),
    },
  };
}

export function createEntryFromForm(formState: EntryFormState): DailyEntry {
  const date = isValidDateKey(formState.date) ? formState.date : formatDateKey(new Date());

  return {
    id: date,
    date,
    health: {
      steps: toInteger(formState.health.steps),
      sleepHours: toDecimal(formState.health.sleepHours),
      waterGlasses: toInteger(formState.health.waterGlasses),
      weightKg: toDecimal(formState.health.weightKg),
    },
    mood: {
      moodScore: clamp(toInteger(formState.mood.moodScore), 1, 10),
      energyLevel: clamp(toInteger(formState.mood.energyLevel), 1, 10),
      stressLevel: clamp(toInteger(formState.mood.stressLevel), 1, 10),
      note: formState.mood.note.trim(),
    },
    productivity: {
      focusMinutes: toInteger(formState.productivity.focusMinutes),
      tasksCompleted: toInteger(formState.productivity.tasksCompleted),
      habitScore: clamp(toInteger(formState.productivity.habitScore), 1, 10),
    },
    finances: {
      income: toDecimal(formState.finances.income),
      expenses: toDecimal(formState.finances.expenses),
      savings: toDecimal(formState.finances.savings),
    },
  };
}

export function upsertEntry(entries: DailyEntry[], nextEntry: DailyEntry): DailyEntry[] {
  const withoutCurrentDate = entries.filter((entry) => entry.date !== nextEntry.date);
  return [nextEntry, ...withoutCurrentDate].sort((left, right) => right.date.localeCompare(left.date));
}

export function summariseEntries(entries: DailyEntry[]) {
  if (entries.length === 0) {
    return {
      averageMood: 0,
      averageEnergy: 0,
      averageStress: 0,
      averageSleep: 0,
      totalFocusMinutes: 0,
      totalSavings: 0,
      totalIncome: 0,
      totalExpenses: 0,
    };
  }

  return entries.reduce(
    (summary, entry, _, allEntries) => ({
      averageMood: summary.averageMood + entry.mood.moodScore / allEntries.length,
      averageEnergy: summary.averageEnergy + entry.mood.energyLevel / allEntries.length,
      averageStress: summary.averageStress + entry.mood.stressLevel / allEntries.length,
      averageSleep: summary.averageSleep + entry.health.sleepHours / allEntries.length,
      totalFocusMinutes: summary.totalFocusMinutes + entry.productivity.focusMinutes,
      totalSavings: summary.totalSavings + entry.finances.savings,
      totalIncome: summary.totalIncome + entry.finances.income,
      totalExpenses: summary.totalExpenses + entry.finances.expenses,
    }),
    {
      averageMood: 0,
      averageEnergy: 0,
      averageStress: 0,
      averageSleep: 0,
      totalFocusMinutes: 0,
      totalSavings: 0,
      totalIncome: 0,
      totalExpenses: 0,
    },
  );
}

export function calculateConsistencyStreak(entries: DailyEntry[]): number {
  if (entries.length === 0) {
    return 0;
  }

  const sortedEntries = [...entries].sort((left, right) => right.date.localeCompare(left.date));
  let streak = 1;

  for (let index = 1; index < sortedEntries.length; index += 1) {
    const previousDate = parseDateKey(sortedEntries[index - 1].date);
    const currentDate = parseDateKey(sortedEntries[index].date);
    const difference = Math.round((previousDate.getTime() - currentDate.getTime()) / 86400000);

    if (difference === 1) {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function parseDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00`);
}

function isValidDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toInteger(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
}

function toDecimal(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(Number(parsed.toFixed(2)), 0) : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
