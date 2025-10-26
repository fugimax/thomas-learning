export interface StoryCard {
  id: string;
  text: string;
  characterImage: string;
  characterName: string;
}

export interface Chapter {
  id: number;
  title: string;
  cards: StoryCard[];
}

export interface AppState {
  currentChapter: number;
  currentCard: number;
  visitedChapters: Set<number>;
  tocOpen: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  characterImage: string;
  characterName: string;
}
