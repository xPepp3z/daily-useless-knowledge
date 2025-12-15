export interface UselessFact {
  id: string;
  text: string;
  source: string;
  source_url: string;
  language: string;
  permalink: string;
}

export interface ApiError {
  message: string;
}

export type Language = 'en' | 'it';