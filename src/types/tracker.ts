export type TrackerTab = 'dashboard' | 'daily' | 'overview';

export type DailyEntry = {
  id: string;
  date: string;
  health: {
    steps: number;
    sleepHours: number;
    waterGlasses: number;
    weightKg: number;
  };
  mood: {
    moodScore: number;
    energyLevel: number;
    stressLevel: number;
    note: string;
  };
  productivity: {
    focusMinutes: number;
    tasksCompleted: number;
    habitScore: number;
  };
  finances: {
    income: number;
    expenses: number;
    savings: number;
  };
};

export type EntryFormState = {
  date: string;
  health: {
    steps: string;
    sleepHours: string;
    waterGlasses: string;
    weightKg: string;
  };
  mood: {
    moodScore: string;
    energyLevel: string;
    stressLevel: string;
    note: string;
  };
  productivity: {
    focusMinutes: string;
    tasksCompleted: string;
    habitScore: string;
  };
  finances: {
    income: string;
    expenses: string;
    savings: string;
  };
};
