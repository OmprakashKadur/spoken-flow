import { Word, Sentence, Phrase, Speech, Conversation, ContentType } from '@/types';

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
  try {
    const response = await fetch(`/data/${category}/${page}.${getFileExtension(category)}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${category} data`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
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

export const isLongContent = (category: string): boolean => {
  return ['public-speaking', 'interviews', 'office'].includes(category);
};

export const getContentTitle = (item: ContentType): string => {
  if ('word' in item) return item.word;
  if ('en' in item && 'kn' in item) return item.en;
  if ('phrase' in item) return item.phrase;
  if ('title' in item) return item.title;
  return 'Untitled';
};
