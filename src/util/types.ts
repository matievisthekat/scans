export interface CategorizedAnswers {
  category_number: string;
  category_name: string;
  total: number;
}

export interface Question {
  question_number: string;
  category_number: string;
  question: string;
  answer?: number;
}

export interface Category {
  category_number: string;
  category_name: string;
}
