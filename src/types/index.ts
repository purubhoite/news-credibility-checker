export type VerdictType = 'true' | 'false' | 'partial' | 'unverified';

export interface Source {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  snippet: string;
  reliabilityScore: number;
}

export interface ClaimAnalysis {
  id: string;
  originalClaim: string;
  cleanedClaim: string;
  verdict: VerdictType;
  confidence: number;
  summary: string;
  sources: Source[];
  checkedAt: string;
}

export interface HistoryItem extends ClaimAnalysis {
  timestamp: string;
}

export interface Settings {
  enabledSources: string[];
  spellCorrectEnabled: boolean;
  confidenceThreshold: number;
  language: string;
}

export type PageView = 'search' | 'results' | 'history' | 'settings';

export interface AppState {
  currentPage: PageView;
  currentAnalysis: ClaimAnalysis | null;
  history: HistoryItem[];
  settings: Settings;
  isLoading: boolean;
}