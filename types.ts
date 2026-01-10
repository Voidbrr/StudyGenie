export enum Publisher {
  OXFORD = 'Oxford',
  CAMBRIDGE = 'Cambridge',
  KIFAYAT = 'Kifayat',
  FEROZSONS = 'Ferozsons',
  TECHTREE = 'TechTree',
}

export enum Subject {
  HISTORY = 'History',
  URDU = 'Urdu',
  ENGLISH = 'English',
  MATHS = 'Maths',
  GEOGRAPHY = 'Geography',
  SCIENCE = 'Science',
  ISLAMIAT = 'Islamiat',
  STEM = 'STEM',
}

export interface Flashcard {
  front: string;
  back: string;
  explanation: string;
}

export interface FillInBlank {
  sentence: string; // The sentence with a blank (e.g. "The sky is _____.")
  answer: string;   // The correct answer
}

export interface TrueFalseQuestion {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface ScenarioQuestion {
  scenario: string;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

export interface CourseData {
  id: string;        
  createdAt: number; 
  topic: string;
  grade: string;
  subject: string;
  summary: string;
  flashcards: Flashcard[];
  fillInTheBlanks: FillInBlank[];
  trueFalse: TrueFalseQuestion[];
  scenarios: ScenarioQuestion[];
}

export interface GenerationRequest {
  publisher: Publisher;
  grade: string;
  subject: Subject;
  topic: string;
}