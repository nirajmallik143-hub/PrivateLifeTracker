import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import type { DailyEntry } from '../types/tracker';
import { formatCurrency, formatDateLabel } from '../utils/format';

type DashboardScreenProps = {
  entries: DailyEntry[];
  onOpenDailyEntry: () => void;
};

export function DashboardScreen({ entries, onOpenDailyEntry }: DashboardScreenProps) {
  const latestEntry = entries[0];

  if (!latestEntry) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No entries yet</Text>
        <Text style={styles.emptySubtitle}>Create your first private daily entry to populate the dashboard.</Text>
      </View>
    );
  }

  const quickStats = [
    { label: 'Mood', value: `${latestEntry.mood.moodScore}/10`, color: '#8B5CF6' },
    { label: 'Focus', value: `${latestEntry.productivity.focusMinutes} min`, color: '#14B8A6' },
    { label: 'Sleep', value: `${latestEntry.health.sleepHours} hrs`, color: '#0EA5E9' },
    {
      label: 'Net balance',
      value: formatCurrency(latestEntry.finances.income - latestEntry.finances.expenses),
      color: '#F97316',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <View>
          <Text style={styles.heroEyebrow}>Today&apos;s snapshot</Text>
          <Text style={styles.heroTitle}>{formatDateLabel(latestEntry.date)}</Text>
          <Text style={styles.heroSubtitle}>Everything stays local to this device. No sync, no cloud, no sharing.</Text>
        </View>
        <Pressable style={styles.heroButton} onPress={onOpenDailyEntry}>
          <Text style={styles.heroButtonText}>Log today</Text>
        </Pressable>
      </View>

      <View style={styles.quickStatsGrid}>
        {quickStats.map((stat) => (
          <View key={stat.label} style={styles.quickStat}>
            <View style={[styles.quickStatDot, { backgroundColor: stat.color }]} />
            <Text style={styles.quickStatLabel}>{stat.label}</Text>
            <Text style={styles.quickStatValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      <Card title="Health metrics" subtitle="Core physical indicators from your latest entry" accentColor="#0EA5E9">
        <MetricRow label="Steps" value={latestEntry.health.steps.toLocaleString()} />
        <MetricRow label="Sleep" value={`${latestEntry.health.sleepHours} hours`} />
        <MetricRow label="Water" value={`${latestEntry.health.waterGlasses} glasses`} />
        <MetricRow label="Weight" value={`${latestEntry.health.weightKg} kg`} />
      </Card>

      <Card title="Mood" subtitle="Personal wellbeing check-in" accentColor="#8B5CF6">
        <MetricRow label="Mood score" value={`${latestEntry.mood.moodScore}/10`} />
        <MetricRow label="Energy" value={`${latestEntry.mood.energyLevel}/10`} />
        <MetricRow label="Stress" value={`${latestEntry.mood.stressLevel}/10`} />
        <MetricRow label="Note" value={latestEntry.mood.note || 'No note added'} multiline />
      </Card>

      <Card title="Productivity" subtitle="Daily execution and focus" accentColor="#14B8A6">
        <MetricRow label="Focus time" value={`${latestEntry.productivity.focusMinutes} minutes`} />
        <MetricRow label="Tasks done" value={`${latestEntry.productivity.tasksCompleted}`} />
        <MetricRow label="Habit score" value={`${latestEntry.productivity.habitScore}/10`} />
      </Card>

      <Card title="Finances" subtitle="Private money snapshot" accentColor="#F97316">
        <MetricRow label="Income" value={formatCurrency(latestEntry.finances.income)} />
        <MetricRow label="Expenses" value={formatCurrency(latestEntry.finances.expenses)} />
        <MetricRow label="Savings" value={formatCurrency(latestEntry.finances.savings)} />
      </Card>
    </ScrollView>
  );
}

function MetricRow({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <View style={[styles.metricRow, multiline ? styles.metricRowWrap : null]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, multiline ? styles.metricValueMultiline : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#1D4ED8',
    borderRadius: 24,
    padding: 20,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  heroEyebrow: {
    color: '#BFDBFE',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#EFF6FF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  heroSubtitle: {
    color: '#DBEAFE',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 220,
  },
  heroButton: {
    alignSelf: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  heroButtonText: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '700',
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickStat: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  quickStatDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginBottom: 10,
  },
  quickStatLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  quickStatValue: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricRowWrap: {
    flexDirection: 'column',
  },
  metricLabel: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  metricValue: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  metricValueMultiline: {
    color: '#1E293B',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
});
