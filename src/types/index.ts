export interface Word {
  id: number;
  word: string;
  meaning: string;
}

export interface Sentence {
  id: number;
  en: string;
  kn: string;
}

export interface Phrase {
  id: number;
  phrase: string;
  meaning: string;
}

export interface Speech {
  id: number;
  title: string;
  content: string[];
}

export interface DialogueLine {
  speaker: string;
  en: string;
}

export interface Conversation {
  id: number;
  title: string;
  dialogue: DialogueLine[];
}

export type ContentType = Word | Sentence | Phrase | Speech | Conversation;

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
}

export interface MarkedItem {
  category: string;
  id: number;
  timestamp: number;
}

export interface UserProgress {
  lastVisitedPage: Record<string, number>;
  markedItems: MarkedItem[];
}
