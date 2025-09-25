
export type Page = 'dashboard' | 'chat' | 'podcasts';

export type Timeframe = 'Monthly' | 'Weekly';

export interface HighLevelMetric {
  title: string;
  value: string;
}

export interface Concern {
  name: string;
  value: number;
  breakdown?: Concern[];
  // Fix: Add index signature to satisfy recharts data prop type requirements.
  [key: string]: any;
}

export interface Procedure {
  name:string;
  count: number;
  percentage: number;
}

export interface TrendData {
  month: string;
  [key: string]: string | number;
}

export interface PatientExperienceData {
  month: string;
  score: number;
}

export interface DemographicConcern {
  group: string;
  concerns: { name: string; value: number }[];
}

export interface SeasonalTrend {
  season: string;
  concern: string;
  increase: number;
}

export interface SalesScore {
  skill: string;
  score: number;
}

export interface DashboardData {
  highLevelMetrics: HighLevelMetric[];
  concerns: Concern[];
  topProcedures: Procedure[];
  treatmentTrends: TrendData[];
  satisfactionScores: PatientExperienceData[];
  educationScores: PatientExperienceData[];
  workflowQuality: {
    strengths: string[];
    opportunities: string[];
  };
  demographics: DemographicConcern[];
  seasonalTrends: SeasonalTrend[];
  salesExcellence: SalesScore[];
  analysisFields: { category: string; summary: string }[];
}

export interface NarrativePaneInfo {
  isOpen: boolean;
  title: string;
  content: string;
}

export interface Podcast {
  id: number;
  title: string;
  date: string;
  duration: string;
  summary: string;
  audioUrl: string;
  imageUrl: string;
}
