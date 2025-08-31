import { UserProgress, MarkedItem } from '@/types';

const STORAGE_KEY = 'english-learning-progress';

export const getStoredProgress = (): UserProgress => {
  if (typeof window === 'undefined') {
    return { lastVisitedPage: {}, markedItems: [] };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { lastVisitedPage: {}, markedItems: [] };
  } catch {
    return { lastVisitedPage: {}, markedItems: [] };
  }
};

export const saveProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

export const updateLastVisitedPage = (category: string, page: number): void => {
  const progress = getStoredProgress();
  progress.lastVisitedPage[category] = page;
  saveProgress(progress);
};

export const getLastVisitedPage = (category: string): number => {
  const progress = getStoredProgress();
  return progress.lastVisitedPage[category] || 1;
};

export const toggleMarkedItem = (category: string, id: number): boolean => {
  const progress = getStoredProgress();
  const existingIndex = progress.markedItems.findIndex(
    item => item.category === category && item.id === id
  );
  
  if (existingIndex >= 0) {
    // Remove marked item
    progress.markedItems.splice(existingIndex, 1);
    saveProgress(progress);
    return false;
  } else {
    // Add marked item
    progress.markedItems.push({
      category,
      id,
      timestamp: Date.now()
    });
    saveProgress(progress);
    return true;
  }
};

export const isItemMarked = (category: string, id: number): boolean => {
  const progress = getStoredProgress();
  return progress.markedItems.some(
    item => item.category === category && item.id === id
  );
};

export const getMarkedItems = (): MarkedItem[] => {
  const progress = getStoredProgress();
  return progress.markedItems.sort((a, b) => b.timestamp - a.timestamp);
};

export const getMarkedItemsByCategory = (category: string): MarkedItem[] => {
  const progress = getStoredProgress();
  return progress.markedItems
    .filter(item => item.category === category)
    .sort((a, b) => b.timestamp - a.timestamp);
};
