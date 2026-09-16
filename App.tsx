import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import { TabButton } from './src/components/TabButton';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { DailyEntryScreen } from './src/screens/DailyEntryScreen';
import { OverviewScreen } from './src/screens/OverviewScreen';
import { loadEntries, saveEntries } from './src/storage/trackerStorage';
import { createEntryFromForm, createSeedEntries, toEntryFormState, upsertEntry } from './src/utils/entryData';
import type { DailyEntry, EntryFormState, TrackerTab } from './src/types/tracker';

const tabs: { key: TrackerTab; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '◉' },
  { key: 'daily', label: 'Daily Entry', icon: '✎' },
  { key: 'overview', label: 'Overview', icon: '△' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TrackerTab>('dashboard');
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Secure local storage enabled');

  useEffect(() => {
    let isMounted = true;

    const initialiseEntries = async () => {
      try {
        const storedEntries = await loadEntries();
        const nextEntries = storedEntries.length > 0 ? storedEntries : createSeedEntries();

        if (!isMounted) {
          return;
        }

        setEntries(nextEntries);

        if (storedEntries.length === 0) {
          await saveEntries(nextEntries);
        }

        setStatusMessage(
          storedEntries.length > 0
            ? 'Loaded from encrypted on-device storage'
            : 'Starter data saved securely on this device',
        );
      } catch {
        if (isMounted) {
          const fallbackEntries = createSeedEntries();
          setEntries(fallbackEntries);
          setStatusMessage('Storage unavailable, using local starter data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initialiseEntries();

    return () => {
      isMounted = false;
    };
  }, []);

  const latestEntry = useMemo(() => entries[0], [entries]);
  const latestFormState = useMemo<EntryFormState>(() => toEntryFormState(latestEntry), [latestEntry]);

  const handleSaveEntry = async (formState: EntryFormState) => {
    const nextEntry = createEntryFromForm(formState);
    const updatedEntries = upsertEntry(entries, nextEntry);

    setStatusMessage('Saving securely on this device…');
    setEntries(updatedEntries);

    try {
      await saveEntries(updatedEntries);
      setStatusMessage(`Saved ${nextEntry.date} locally to encrypted storage`);
      setActiveTab('dashboard');
    } catch {
      setStatusMessage('Unable to persist data. Your latest changes remain on screen.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Private • Local • Android Ready</Text>
          <Text style={styles.title}>PrivateLifeTracker</Text>
          <Text style={styles.subtitle}>
            A personal dashboard for health, mood, productivity, and finances with on-device storage
            only.
          </Text>
          <View style={styles.storageBadge}>
            <Text style={styles.storageBadgeLabel}>{statusMessage}</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.key}
              onPress={() => setActiveTab(tab.key)}
            />
          ))}
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text style={styles.loadingText}>Loading your private tracker…</Text>
            </View>
          ) : null}

          {!isLoading && activeTab === 'dashboard' ? (
            <DashboardScreen entries={entries} onOpenDailyEntry={() => setActiveTab('daily')} />
          ) : null}

          {!isLoading && activeTab === 'daily' ? (
            <DailyEntryScreen
              initialValues={latestFormState}
              onSave={handleSaveEntry}
              saveHint={statusMessage}
            />
          ) : null}

          {!isLoading && activeTab === 'overview' ? <OverviewScreen entries={entries} /> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  eyebrow: {
    color: '#7DD3FC',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 30,
    fontWeight: '700',
    marginTop: 6,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  storageBadge: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#172554',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  storageBadgeLabel: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: -18,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
});
