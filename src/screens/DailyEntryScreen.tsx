import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Card } from '../components/Card';
import { MetricInput } from '../components/MetricInput';
import type { EntryFormState } from '../types/tracker';
import { formatDateLabel } from '../utils/format';

type DailyEntryScreenProps = {
  initialValues: EntryFormState;
  onSave: (formState: EntryFormState) => Promise<void>;
  saveHint: string;
};

export function DailyEntryScreen({ initialValues, onSave, saveHint }: DailyEntryScreenProps) {
  const [formState, setFormState] = useState<EntryFormState>(initialValues);

  useEffect(() => {
    setFormState(initialValues);
  }, [initialValues]);

  const updateField = (path: string, value: string) => {
    const [section, key] = path.split('.');

    if (section === 'date') {
      setFormState((current) => ({ ...current, date: value }));
      return;
    }

    setFormState((current) => ({
      ...current,
      [section]: {
        ...current[section as keyof Omit<EntryFormState, 'date'>],
        [key]: value,
      },
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Card
        title="Daily private entry"
        subtitle="Log your personal metrics for one day. Entries replace the same date and remain local-only."
        accentColor="#1D4ED8"
      >
        <MetricInput
          label="Date (YYYY-MM-DD)"
          value={formState.date}
          onChangeText={(value) => updateField('date', value)}
          placeholder="2026-09-16"
          keyboardType="numbers-and-punctuation"
        />
        <Text style={styles.helperText}>Current entry label: {formatDateLabel(formState.date)}</Text>
      </Card>

      <Card title="Health metrics" subtitle="Track movement, recovery, hydration, and weight" accentColor="#0EA5E9">
        <MetricInput
          label="Steps"
          value={formState.health.steps}
          onChangeText={(value) => updateField('health.steps', value)}
          placeholder="9200"
        />
        <MetricInput
          label="Sleep hours"
          value={formState.health.sleepHours}
          onChangeText={(value) => updateField('health.sleepHours', value)}
          placeholder="7.5"
        />
        <MetricInput
          label="Water glasses"
          value={formState.health.waterGlasses}
          onChangeText={(value) => updateField('health.waterGlasses', value)}
          placeholder="8"
        />
        <MetricInput
          label="Weight (kg)"
          value={formState.health.weightKg}
          onChangeText={(value) => updateField('health.weightKg', value)}
          placeholder="68.2"
        />
      </Card>

      <Card title="Mood" subtitle="Capture how the day felt" accentColor="#8B5CF6">
        <MetricInput
          label="Mood score (1-10)"
          value={formState.mood.moodScore}
          onChangeText={(value) => updateField('mood.moodScore', value)}
          placeholder="8"
        />
        <MetricInput
          label="Energy level (1-10)"
          value={formState.mood.energyLevel}
          onChangeText={(value) => updateField('mood.energyLevel', value)}
          placeholder="7"
        />
        <MetricInput
          label="Stress level (1-10)"
          value={formState.mood.stressLevel}
          onChangeText={(value) => updateField('mood.stressLevel', value)}
          placeholder="4"
        />
        <MetricInput
          label="Private note"
          value={formState.mood.note}
          onChangeText={(value) => updateField('mood.note', value)}
          placeholder="Kept the day balanced and focused"
          keyboardType="default"
          multiline
        />
      </Card>

      <Card title="Productivity" subtitle="Measure focused work and habits" accentColor="#14B8A6">
        <MetricInput
          label="Focus minutes"
          value={formState.productivity.focusMinutes}
          onChangeText={(value) => updateField('productivity.focusMinutes', value)}
          placeholder="120"
        />
        <MetricInput
          label="Tasks completed"
          value={formState.productivity.tasksCompleted}
          onChangeText={(value) => updateField('productivity.tasksCompleted', value)}
          placeholder="6"
        />
        <MetricInput
          label="Habit score (1-10)"
          value={formState.productivity.habitScore}
          onChangeText={(value) => updateField('productivity.habitScore', value)}
          placeholder="7"
        />
      </Card>

      <Card title="Finances" subtitle="Keep a local record of income, expenses, and savings" accentColor="#F97316">
        <MetricInput
          label="Income"
          value={formState.finances.income}
          onChangeText={(value) => updateField('finances.income', value)}
          placeholder="145.00"
        />
        <MetricInput
          label="Expenses"
          value={formState.finances.expenses}
          onChangeText={(value) => updateField('finances.expenses', value)}
          placeholder="62.50"
        />
        <MetricInput
          label="Savings"
          value={formState.finances.savings}
          onChangeText={(value) => updateField('finances.savings', value)}
          placeholder="80.00"
        />
      </Card>

      <Pressable style={styles.saveButton} onPress={() => void onSave(formState)}>
        <Text style={styles.saveButtonText}>Save securely on this device</Text>
      </Pressable>

      <Text style={styles.saveHint}>{saveHint}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  helperText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#EFF6FF',
    fontSize: 16,
    fontWeight: '700',
  },
  saveHint: {
    color: '#475569',
    fontSize: 13,
    textAlign: 'center',
  },
});
