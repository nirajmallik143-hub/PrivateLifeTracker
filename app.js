const STORAGE_KEY = 'private-life-tracker.entries.v1';
const INSTALL_HELP_IOS = 'On iPhone or iPad, open this page in Safari, tap Share, then choose “Add to Home Screen”.';
const INSTALL_HELP_ANDROID = 'Use your browser menu or the install prompt to add PrivateLifeTracker to your Android home screen.';

const entryForm = document.querySelector('#entry-form');
const entriesList = document.querySelector('#entries-list');
const emptyState = document.querySelector('#empty-state');
const summaryCount = document.querySelector('#summary-count');
const summaryCategory = document.querySelector('#summary-category');
const summaryDate = document.querySelector('#summary-date');
const storageStatus = document.querySelector('#storage-status');
const exportButton = document.querySelector('#export-button');
const importInput = document.querySelector('#import-input');
const clearButton = document.querySelector('#clear-button');
const installButton = document.querySelector('#install-button');
const installHelp = document.querySelector('#install-help');
const template = document.querySelector('#entry-template');

let deferredInstallPrompt = null;
let entries = loadEntries();

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

function isValidEntry(entry) {
  return Boolean(
    entry &&
      typeof entry.id === 'string' &&
      typeof entry.date === 'string' &&
      typeof entry.category === 'string' &&
      typeof entry.value === 'string' &&
      typeof entry.note === 'string'
  );
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function escapeText(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function createEntry(formData) {
  return {
    id: crypto.randomUUID(),
    date: formData.get('date'),
    category: escapeText(String(formData.get('category') || '')).slice(0, 40),
    value: escapeText(String(formData.get('value') || '')).slice(0, 60),
    note: String(formData.get('note') || '').trim().slice(0, 240)
  };
}

function render() {
  const sortedEntries = [...entries].sort((left, right) => `${right.date}-${right.id}`.localeCompare(`${left.date}-${left.id}`));

  entriesList.textContent = '';

  sortedEntries.forEach((entry) => {
    const fragment = template.content.cloneNode(true);
    const item = fragment.querySelector('.entry-item');
    const meta = fragment.querySelector('.entry-meta');
    const value = fragment.querySelector('.entry-value');
    const note = fragment.querySelector('.entry-note');
    const removeButton = fragment.querySelector('button');

    meta.textContent = `${entry.category} • ${formatDate(entry.date)}`;
    value.textContent = entry.value;
    note.textContent = entry.note || 'No note';
    removeButton.addEventListener('click', () => {
      entries = entries.filter((savedEntry) => savedEntry.id !== entry.id);
      saveEntries();
      render();
    });

    item.dataset.entryId = entry.id;
    entriesList.append(fragment);
  });

  const latestEntry = sortedEntries[0];
  summaryCount.textContent = String(entries.length);
  summaryCategory.textContent = latestEntry?.category || '—';
  summaryDate.textContent = latestEntry ? formatDate(latestEntry.date) : '—';
  emptyState.hidden = entries.length > 0;
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function showStatus(message) {
  storageStatus.textContent = message;
}

entryForm.querySelector('#entry-date').valueAsDate = new Date();
render();

entryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(entryForm);
  const entry = createEntry(formData);

  if (!entry.date || !entry.category || !entry.value) {
    showStatus('Date, category, and value are required.');
    return;
  }

  entries = [entry, ...entries];
  saveEntries();
  render();
  entryForm.reset();
  entryForm.querySelector('#entry-date').valueAsDate = new Date();
  showStatus('Entry saved only on this device.');
});

exportButton.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `private-life-tracker-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showStatus('Exported a local JSON backup.');
});

importInput.addEventListener('change', async (event) => {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const parsed = JSON.parse(await file.text());
    if (!Array.isArray(parsed) || parsed.some((entry) => !isValidEntry(entry))) {
      throw new Error('Invalid backup format');
    }

    entries = parsed;
    saveEntries();
    render();
    showStatus('Imported local backup successfully.');
  } catch {
    showStatus('Unable to import that file. Please choose a backup exported by this app.');
  } finally {
    importInput.value = '';
  }
});

clearButton.addEventListener('click', () => {
  if (!window.confirm('Delete all locally stored tracker entries from this device?')) {
    return;
  }

  entries = [];
  localStorage.removeItem(STORAGE_KEY);
  render();
  showStatus('All local tracker data has been deleted from this device.');
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
  installHelp.textContent = INSTALL_HELP_ANDROID;
});

installButton.addEventListener('click', async () => {
  if (!deferredInstallPrompt) {
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

window.addEventListener('appinstalled', () => {
  installButton.hidden = true;
  installHelp.textContent = 'Installed successfully. Your data stays local to this browser storage on the device.';
});

if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  installHelp.textContent = INSTALL_HELP_IOS;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js');
      showStatus('Ready for offline use after the first load. Data stays stored locally on this device.');
    } catch {
      showStatus('Offline support could not be enabled, but your entries still stay local to this device.');
    }
  });
}
