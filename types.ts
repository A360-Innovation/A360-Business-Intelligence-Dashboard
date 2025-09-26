
export type Page = 'dashboard' | 'chat' | 'podcasts' | 'practice' | 'treatments' | 'journey' | 'performance' | 'forecasting' | 'market';

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

export type JourneyEventType = 'Inquiry' | 'Consultation' | 'Objection' | 'Resolution' | 'Treatment' | 'Follow-up' | 'Satisfaction';

export interface JourneyEvent {
    type: JourneyEventType;
    title: string;
    date: string;
    summary: string;
    details?: string;
}

export interface PatientJourney {
    id: number;
    title: string;
    description: string;
    patientProfile: {
        name: string;
        age: number;
        concern: string;
    };
    events: JourneyEvent[];
}

// Types for Practitioner Performance Page
export interface PractitionerMetric {
    title: string;
    value: string;
    trend: string;
    trendDirection: 'up' | 'down' | 'neutral';
}

export interface PractitionerSkillScore {
    skill: string;
    score: number;
}

export interface PractitionerProfile {
    id: number;
    name: string;
    role: string;
    avatarUrl: string;
    overallScore: number;
    keyMetrics: PractitionerMetric[];
    skillScores: PractitionerSkillScore[];
    strengths: string[];
    opportunities: string[];
}

// Types for Voice Consultation Simulator
export interface Scenario {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  persona: {
      name: string;
      avatarUrl: string;
  };
  initialMessage: string;
}

export type SimulationStatus = 'idle' | 'listening' | 'speaking' | 'analyzing' | 'ended';

export interface TranscriptMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export type FeedbackType = 'error' | 'tip' | 'success';

export interface FeedbackNotification {
    id: number;
    type: FeedbackType;
    message: string;
    transcriptId: number; // links feedback to a specific message
}

// Types for Forecasting Page
export interface ForecastDataPoint {
  month: string;
  [key: string]: number | string; // e.g., Botox: 140, Botox_forecast: 145
}

export interface EmergingConcern {
  name: string;
  growth: number;
  summary: string;
}

export interface CampaignSimulation {
  treatment: string;
  campaign: string;
  predictedIncrease: number;
  summary: string;
}

// Types for Market Intelligence Page
export interface CompetitorPricing {
    treatment: string;
    ourPrice: number;
    competitorAvg: number;
    marketRange: string;
}

export interface SocialTrend {
    name: string;
    platform: 'TikTok' | 'Instagram';
    volume: string;
    summary: string;
}

export interface ShareOfVoice {
    name: string;
    value: number;
}

export interface MarketIntelData {
    competitorPricing: CompetitorPricing[];
    socialTrends: SocialTrend[];
    shareOfVoice: ShareOfVoice[];
    topSearchTerms: string[];
}