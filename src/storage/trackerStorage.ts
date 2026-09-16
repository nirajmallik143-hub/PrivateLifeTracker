import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { DailyEntry } from '../types/tracker';

const STORAGE_KEY = 'private-life-tracker.entries.v1';

export async function loadEntries(): Promise<DailyEntry[]> {
  const stored = await readValue();

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as DailyEntry[];
  } catch {
    return [];
  }
}

export async function saveEntries(entries: DailyEntry[]): Promise<void> {
  await writeValue(JSON.stringify(entries));
}

async function readValue(): Promise<string | null> {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY);
  }

  return SecureStore.getItemAsync(STORAGE_KEY);
}

async function writeValue(value: string): Promise<void> {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(STORAGE_KEY, value);
}
