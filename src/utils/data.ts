import { ContentType } from '@/types';

// Cache for storing loaded data
const dataCache = new Map<string, ContentType[]>();
// Cache for page existence checks
const pageExistenceCache = new Map<string, boolean>();

export const categories = [
  {
    id: 'words',
    name: 'Words',
    description: 'Learn essential English vocabulary',
    icon: '📚',
    path: '/categories/words'
  },
  {
    id: 'sentences',
    name: 'Sentences',
    description: 'Practice common English sentences',
    icon: '💬',
    path: '/categories/sentences'
  },
  {
    id: 'phrases',
    name: 'Phrases',
    description: 'Master English idioms and phrases',
    icon: '🎯',
    path: '/categories/phrases'
  },
  {
    id: 'public-speaking',
    name: 'Public Speaking',
    description: 'Improve your speech delivery',
    icon: '🎤',
    path: '/categories/public-speaking'
  },
  {
    id: 'interviews',
    name: 'Interviews',
    description: 'Practice interview conversations',
    icon: '🤝',
    path: '/categories/interviews'
  },
  {
    id: 'office',
    name: 'Office',
    description: 'Learn workplace communication',
    icon: '🏢',
    path: '/categories/office'
  }
];

export const loadData = async <T extends ContentType>(
  category: string,
  page: number
): Promise<T[]> => {
  const cacheKey = `${category}-${page}`;
  
  // Check cache first
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey)! as T[];
  }
  
  try {
    const response = await fetch(`/data/${category}/${page}.${getFileExtension(category)}.json`);
    if (!response.ok) {
      // Cache that this page doesn't exist
      pageExistenceCache.set(cacheKey, false);
      throw new Error(`Failed to load ${category} data`);
    }
    
    const data = await response.json();
    const result = Array.isArray(data) ? data : [data];
    
    // Cache the result and mark page as existing
    dataCache.set(cacheKey, result);
    pageExistenceCache.set(cacheKey, true);
    
    return result as T[];
  } catch (error) {
    console.error(`Error loading ${category} data:`, error);
    return [];
  }
};

export const getFileExtension = (category: string): string => {
  switch (category) {
    case 'words':
      return 'words';
    case 'sentences':
      return 'sentences';
    case 'phrases':
      return 'phrases';
    case 'public-speaking':
      return 'speech';
    case 'interviews':
    case 'office':
      return 'conversation';
    default:
      return 'json';
  }
};

export const getAvailablePages = async (category: string): Promise<number[]> => {
  const pages: number[] = [];
  let page = 1;
  
  while (true) {
    try {
      const response = await fetch(`/data/${category}/${page}.${getFileExtension(category)}.json`);
      if (response.ok) {
        pages.push(page);
        page++;
      } else {
        break;
      }
    } catch {
      break;
    }
  }
  
  return pages;
};

// Quick check if a page exists (uses cache)
export const checkPageExists = async (category: string, page: number): Promise<boolean> => {
  const cacheKey = `${category}-${page}`;
  
  // Check cache first
  if (pageExistenceCache.has(cacheKey)) {
    return pageExistenceCache.get(cacheKey)!;
  }
  
  try {
    const response = await fetch(`/data/${category}/${page}.${getFileExtension(category)}.json`);
    const exists = response.ok;
    pageExistenceCache.set(cacheKey, exists);
    return exists;
  } catch {
    pageExistenceCache.set(cacheKey, false);
    return false;
  }
};

export const isLongContent = (category: string): boolean => {
  return ['public-speaking', 'interviews', 'office'].includes(category);
};

export const getContentTitle = (item: ContentType): string => {
  if ('word' in item) return item.word;
  if ('en' in item && 'meaning' in item) return item.en;
  if ('phrase' in item) return item.phrase;
  if ('title' in item) return item.title;
  return 'Untitled';
};

// Preload next page for better UX
export const preloadNextPage = async (category: string, currentPage: number): Promise<void> => {
  const nextPage = currentPage + 1;
  const extension = getFileExtension(category);
  
  try {
    const response = await fetch(`/data/${category}/${nextPage}.${extension}.json`);
    if (response.ok) {
      const data = await response.json();
      const cacheKey = `${category}-${nextPage}`;
      dataCache.set(cacheKey, Array.isArray(data) ? data : [data]);
    }
  } catch {
    // Silently fail for preloading
  }
};

// Clear cache for a specific category (useful when switching categories)
export const clearCategoryCache = (category: string): void => {
  for (const key of dataCache.keys()) {
    if (key.startsWith(`${category}-`)) {
      dataCache.delete(key);
    }
  }
  
  // Also clear page existence cache
  for (const key of pageExistenceCache.keys()) {
    if (key.startsWith(`${category}-`)) {
      pageExistenceCache.delete(key);
    }
  }
};
