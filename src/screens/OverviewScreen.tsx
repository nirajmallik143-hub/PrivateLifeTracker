import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import type { DailyEntry } from '../types/tracker';
import { calculateConsistencyStreak, summariseEntries } from '../utils/entryData';
import { formatCurrency, formatDateLabel } from '../utils/format';

type OverviewScreenProps = {
  entries: DailyEntry[];
};

export function OverviewScreen({ entries }: OverviewScreenProps) {
  const summary = summariseEntries(entries);
  const streak = calculateConsistencyStreak(entries);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Card
        title="Overview analytics"
        subtitle="High-level trends from your private entries without leaving the device"
        accentColor="#1D4ED8"
      >
        <View style={styles.analyticsGrid}>
          <AnalyticsTile label="Avg mood" value={`${summary.averageMood.toFixed(1)}/10`} />
          <AnalyticsTile label="Avg sleep" value={`${summary.averageSleep.toFixed(1)} hrs`} />
          <AnalyticsTile label="Focus total" value={`${summary.totalFocusMinutes} min`} />
          <AnalyticsTile label="Savings total" value={formatCurrency(summary.totalSavings)} />
        </View>
      </Card>

      <Card title="Consistency" subtitle="Keep the streak alive with daily entries" accentColor="#14B8A6">
        <AnalyticsRow label="Current streak" value={`${streak} day${streak === 1 ? '' : 's'}`} />
        <AnalyticsRow label="Entries stored" value={`${entries.length}`} />
        <AnalyticsRow label="Latest record" value={entries[0] ? formatDateLabel(entries[0].date) : 'No entries'} />
      </Card>

      <Card title="Latest insights" subtitle="Simple computed guidance from your recent data" accentColor="#8B5CF6">
        <InsightText text={`Mood and energy are averaging ${summary.averageMood.toFixed(1)}/10 and ${summary.averageEnergy.toFixed(1)}/10 across stored entries.`} />
        <InsightText text={`Your average stress level is ${summary.averageStress.toFixed(1)}/10 with ${summary.totalFocusMinutes} minutes of recorded focus time.`} />
        <InsightText text={`Net balance across saved entries is ${formatCurrency(summary.totalIncome - summary.totalExpenses)}.`} />
      </Card>

      <Card title="Recent entries" subtitle="Recent snapshots for quick review" accentColor="#F97316">
        {entries.slice(0, 5).map((entry) => (
          <View key={entry.id} style={styles.entryRow}>
            <View>
              <Text style={styles.entryDate}>{formatDateLabel(entry.date)}</Text>
              <Text style={styles.entryMeta}>
                Mood {entry.mood.moodScore}/10 • Focus {entry.productivity.focusMinutes} min • Steps{' '}
                {entry.health.steps.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.entryValue}>{formatCurrency(entry.finances.savings)}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

function AnalyticsTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.analyticsTile}>
      <Text style={styles.analyticsLabel}>{label}</Text>
      <Text style={styles.analyticsValue}>{value}</Text>
    </View>
  );
}

function AnalyticsRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.analyticsRow}>
      <Text style={styles.analyticsRowLabel}>{label}</Text>
      <Text style={styles.analyticsRowValue}>{value}</Text>
    </View>
  );
}

function InsightText({ text }: { text: string }) {
  return <Text style={styles.insightText}>• {text}</Text>;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analyticsTile: {
    width: '47%',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
  },
  analyticsLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  analyticsValue: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  analyticsRowLabel: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  analyticsRowValue: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  insightText: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 21,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  entryDate: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  entryMeta: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    maxWidth: 230,
  },
  entryValue: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '700',
  },
});
