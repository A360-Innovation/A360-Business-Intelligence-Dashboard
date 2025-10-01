// Fix: Import Timeframe type
import { DashboardData, Timeframe } from './types';

const monthlyData: DashboardData = {
  highLevelMetrics: [
    // Fix: Added missing 'subtitle' and 'icon' properties to align with HighLevelMetric type.
    { title: "Total Transcripts This Month", value: "432", subtitle: "Consultations analyzed", icon: "FileText" },
    { title: "Overall Satisfaction Score", value: "92%", subtitle: "Avg. patient feedback", icon: "Smile" },
    { title: "Education Effectiveness", value: "88%", subtitle: "Patient comprehension", icon: "BookOpen" },
    { title: "Top Procedures Recommended", value: "Botox, Chemical Peel, IPL Photofacial", subtitle: "Most frequent recommendations", icon: "TrendingUp" },
  ],
  concerns: [
    { name: 'Skin Pigmentation', value: 35, breakdown: [{ name: 'Melasma', value: 45 }, { name: 'Sunspots', value: 30 }, { name: 'PIH', value: 15 }, { name: 'Other', value: 10 }] },
    { name: 'Wrinkles / Aging', value: 30 },
    { name: 'Acne / Breakouts', value: 20 },
    { name: 'Texture / Scarring', value: 10 },
    { name: 'Other', value: 5 },
  ],
  topProcedures: [
    { name: 'Botox', count: 140, percentage: 32 },
    { name: 'Dermal Fillers', count: 110, percentage: 25 },
    { name: 'Chemical Peel', count: 80, percentage: 19 },
    { name: 'IPL Photofacial', count: 65, percentage: 15 },
    { name: 'Laser Resurfacing', count: 37, percentage: 9 },
  ],
  treatmentTrends: [
    { month: 'Apr', Botox: 120, Fillers: 95, Peel: 60, IPL: 50, Laser: 30 },
    { month: 'May', Botox: 135, Fillers: 102, Peel: 72, IPL: 58, Laser: 28 },
    { month: 'Jun', Botox: 142, Fillers: 106, Peel: 75, IPL: 60, Laser: 32 },
    { month: 'Jul', Botox: 130, Fillers: 98, Peel: 68, IPL: 55, Laser: 35 },
    { month: 'Aug', Botox: 138, Fillers: 105, Peel: 77, IPL: 62, Laser: 36 },
    { month: 'Sep', Botox: 140, Fillers: 110, Peel: 80, IPL: 65, Laser: 37 },
  ],
  satisfactionScores: [
    { month: 'Apr', score: 87 }, { month: 'May', score: 90 }, { month: 'Jun', score: 91 },
    { month: 'Jul', score: 89 }, { month: 'Aug', score: 93 }, { month: 'Sep', score: 92 },
  ],
  educationScores: [
    { month: 'Apr', score: 82 }, { month: 'May', score: 84 }, { month: 'Jun', score: 85 },
    { month: 'Jul', score: 86 }, { month: 'Aug', score: 89 }, { month: 'Sep', score: 88 },
  ],
  workflowQuality: {
    strengths: ['Rapport Building', 'Active Listening', 'Education', 'Treatment Planning'],
    opportunities: ['Objection Handling', 'Upselling', 'Referrals', 'Closing'],
  },
  demographics: [
    { group: '18-25', concerns: [{ name: 'Acne', value: 40 }, { name: 'Pigmentation', value: 25 }, { name: 'Scarring', value: 20 }] },
    { group: '26-35', concerns: [{ name: 'Pigmentation', value: 38 }, { name: 'Acne', value: 22 }, { name: 'Wrinkles', value: 18 }] },
    { group: '36-45', concerns: [{ name: 'Wrinkles', value: 40 }, { name: 'Pigmentation', value: 30 }, { name: 'Texture', value: 15 }] },
    { group: '46-60', concerns: [{ name: 'Wrinkles', value: 50 }, { name: 'Sagging', value: 30 }, { name: 'Pigmentation', value: 15 }] },
    { group: '60+', concerns: [{ name: 'Wrinkles', value: 55 }, { name: 'Volume Loss', value: 25 }, { name: 'Texture', value: 10 }] },
  ],
  seasonalTrends: [
    { season: 'Spring', concern: 'Acne', increase: 24 },
    { season: 'Summer', concern: 'Pigmentation', increase: 35 },
    { season: 'Fall', concern: 'Wrinkles', increase: 18 },
    { season: 'Winter', concern: 'Dryness/Texture', increase: 20 },
  ],
  salesExcellence: [
    { skill: 'Rapport Building', score: 92 },
    { skill: 'Discovery & Active Listening', score: 89 },
    { skill: 'Education & Product Knowledge', score: 88 },
    { skill: 'Objection Handling', score: 75 },
    { skill: 'Treatment Planning', score: 90 },
    { skill: 'Upselling / Cross-Selling', score: 72 },
    { skill: 'Referral Requesting', score: 68 },
    { skill: 'Closing', score: 70 },
    { skill: 'Compliance with Practice Preferences', score: 85 },
  ],
  analysisFields: [
    { category: 'Objection Handling', summary: 'Providers acknowledge concerns but need structured phrasing (use Feel–Felt–Found method).' },
    { category: 'Upselling', summary: 'Opportunities to suggest complementary treatments are missed in 30% of consultations.' },
  ]
};

const weeklyData: DashboardData = {
  ...monthlyData,
  highLevelMetrics: [
    // Fix: Added missing 'subtitle' and 'icon' properties to align with HighLevelMetric type.
    { title: "Total Transcripts This Week", value: "98", subtitle: "Consultations analyzed", icon: "FileText" },
    { title: "Overall Satisfaction Score", value: "94%", subtitle: "Avg. patient feedback", icon: "Smile" },
    { title: "Education Effectiveness", value: "91%", subtitle: "Patient comprehension", icon: "BookOpen" },
    { title: "Top Procedures Recommended", value: "Botox, Dermal Fillers, IPL Photofacial", subtitle: "Most frequent recommendations", icon: "TrendingUp" },
  ],
  concerns: [
    { name: 'Skin Pigmentation', value: 32, breakdown: [{ name: 'Melasma', value: 40 }, { name: 'Sunspots', value: 35 }, { name: 'PIH', value: 18 }, { name: 'Other', value: 7 }] },
    { name: 'Wrinkles / Aging', value: 28 },
    { name: 'Acne / Breakouts', value: 25 },
    { name: 'Texture / Scarring', value: 12 },
    { name: 'Other', value: 3 },
  ],
  topProcedures: [
    { name: 'Botox', count: 35, percentage: 36 },
    { name: 'Dermal Fillers', count: 28, percentage: 29 },
    { name: 'Chemical Peel', count: 18, percentage: 18 },
    { name: 'IPL Photofacial', count: 12, percentage: 12 },
    { name: 'Laser Resurfacing', count: 5, percentage: 5 },
  ],
};


export const DASHBOARD_DATA: { [key in Timeframe]: DashboardData } = {
  Monthly: monthlyData,
  Weekly: weeklyData,
};