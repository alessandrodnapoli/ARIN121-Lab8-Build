export type OptionLabel = 'A' | 'B' | 'C' | 'D';

export interface QuizOption {
  label: OptionLabel;
  text: string;
}

export interface QuizQuestion {
  number: number;
  question: string;
  options: QuizOption[];
}

export interface QuizData {
  quizId: string;
  quizToken?: string;
  title: string;
  questions: QuizQuestion[];
  instructions: string;
}

export interface QuestionGradingResult {
  number: number;
  question: string;
  options: QuizOption[];
  selectedOption: OptionLabel;
  correctOption: OptionLabel;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizSubmissionResponse {
  quizId: string;
  title: string;
  score: number;
  total: number;
  percentage: number;
  formattedSubmission: string;
  performanceRating: string;
  results: QuestionGradingResult[];
}
