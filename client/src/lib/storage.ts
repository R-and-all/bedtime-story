export interface LocalStorageData {
  recentCharacters: string[];
  savedSettings: any;
}

export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
  }
  return defaultValue;
}

export function saveRecentCharacters(characters: string[]): void {
  const existing = loadFromLocalStorage<string[]>('recentCharacters', []);
  const updated = [...new Set([...characters, ...existing])].slice(0, 12);
  saveToLocalStorage('recentCharacters', updated);
}

export function getRecentCharacters(): string[] {
  return loadFromLocalStorage<string[]>('recentCharacters', []);
}
