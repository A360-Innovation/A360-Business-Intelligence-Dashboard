
export type Page = 'dashboard' | 'chat' | 'podcasts' | 'practice' | 'treatments' | 'journey' | 'performance' | 'forecasting' | 'market' | 'opportunities' | 'prompts' | 'settings' | 'kpis' | 'clinicPerformance' | 'transcripts';

export type Timeframe = 'Monthly' | 'Weekly';

export interface HighLevelMetric {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
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

export interface Subtitle {
    text: string;
    speaker: string;
    startTime: number;
    endTime: number;
}

export interface Podcast {
  id: string;
  title: string;
  date: string;
  duration?: string;
  summary: string;
  audioUrl: string;
  imageUrl: string;
  topic?: string;
  subtitles?: Subtitle[];
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

// Types for Opportunities Hub
export interface Opportunity {
    transcript_id: string;
    day: string;
    turn_index: number;
    type: string;
    confidence: number | null;
    snippet: string;
    rationale: string | null;
    clinic?: string;
}

// Types for Prompt Library
export interface Prompt {
    id: string;
    category: string;
    title: string;
    description: string;
    prompt: string;
}

// Types for Settings Page
export interface User {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    role: 'Admin' | 'Practitioner' | 'Manager';
    status: 'Active' | 'Pending';
}

export interface ClinicSettings {
    name: string;
    website: string;
}

// Types for Treatment Analysis Page
export interface TreatmentAnalysisMetric {
    title: string;
    value: string;
}

export interface TreatmentObjection {
    title: string;
    description: string;
    frequency?: number;
}

export interface TreatmentCrossSell {
    name: string;
    rationale: string;
    frequency?: number;
}

export interface TreatmentAgeDistribution {
    age_range: string;
    count: number;
}

export interface TreatmentDemographics {
    total_patients: number;
    age_distribution: TreatmentAgeDistribution[];
}

export interface TreatmentAnalysisData {
    keyMetrics: TreatmentAnalysisMetric[];
    objections: TreatmentObjection[];
    crossSell: TreatmentCrossSell[];
    demographics: TreatmentDemographics;
}

// Types for Treatment Education Effectiveness
export interface EducationLabelDistribution {
    label: string;
    count: number;
}

export interface CommonEducationGap {
    gap: string;
    frequency: number;
}

export interface TreatmentEducationData {
    treatment: string;
    total_consultations: number;
    avg_education_effectiveness_pct: number;
    label_distribution: EducationLabelDistribution[];
    common_education_gaps: CommonEducationGap[];
}

// Types for KPIs Page
export interface KpiData {
    day: string;
    clinic?: string;
    transcripts_count: number;
    avg_satisfaction: number | null;
    avg_education_effectiveness: number | null;
    objections_count: number | null;
    top_problems: string[] | null;
    top_procedures: string[] | null;
}

// Types for Clinic Performance Page
export interface ClinicPerformanceData {
    clinicName: string;
    totalConsultations: number;
    totalObjections: number;
    avgSatisfaction: number | null;
    avgEducation: number | null;
}

// Types for Transcripts Page
export interface TranscriptSummary {
    id: string;
    day: string;
    clinic: string;
    duration_min: number;
    num_turns: number;
    satisfaction_score: number | null;
    satisfaction_label: string;
    top_procedures: string[];
    top_problems: string[];
}

export interface TranscriptDetail extends TranscriptSummary {
    consultation_at: string;
    num_chars: number;
    language: string;
    raw_text: string;
    education_effectiveness_score: number | null;
    education_effectiveness_label: string;
}
