import { useState, useEffect } from 'react';
import { DashboardData, HighLevelMetric, Concern, Procedure, TrendData, PatientExperienceData } from '../types';
import { DASHBOARD_DATA } from '../constants';

const API_BASE = 'https://rag-aesthetic-production.up.railway.app/metrics';

export const useDashboardData = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [
                    summaryRes,
                    concernsRes,
                    topProceduresRes,
                    trendsRes,
                    experienceRes
                ] = await Promise.all([
                    fetch(`${API_BASE}/summary?month=2025-06`),
                    fetch(`${API_BASE}/concerns?months=4`),
                    fetch(`${API_BASE}/top_procedures?months=4`),
                    fetch(`${API_BASE}/treatment_trends?months=4`),
                    fetch(`${API_BASE}/experience_timeseries?months=4`)
                ]);

                if (!summaryRes.ok || !concernsRes.ok || !topProceduresRes.ok || !trendsRes.ok || !experienceRes.ok) {
                    const errorResponses = [summaryRes, concernsRes, topProceduresRes, trendsRes, experienceRes].filter(r => !r.ok);
                    throw new Error(`Failed to fetch dashboard data. Status: ${errorResponses.map(r => `${r.url} -> ${r.statusText}`).join(', ')}`);
                }

                const summaryData = await summaryRes.json();
                const concernsData = await concernsRes.json();
                const topProceduresData = await topProceduresRes.json();
                const trendsData = await trendsRes.json();
                const experienceData = await experienceRes.json();

                // 1. Transform Summary -> highLevelMetrics
                const highLevelMetrics: HighLevelMetric[] = [
                    { title: "Total Transcripts", value: String(summaryData.total_transcripts) },
                    { title: "Overall Satisfaction", value: `${summaryData.overall_satisfaction_pct}%` },
                    { title: "Education Effectiveness", value: `${summaryData.education_effectiveness_pct}%` },
                    { title: "Top Procedures", value: summaryData.top_procedures.map((p:string) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') },
                ];

                // 2. Transform Concerns
                const concerns: Concern[] = concernsData.map((c: { label: string; count: number }) => ({
                    name: c.label.charAt(0).toUpperCase() + c.label.slice(1),
                    value: c.count,
                }));

                // 3. Transform Top Procedures
                const topProcedures: Procedure[] = topProceduresData.map((p: { name: string; count: number; pct: number }) => ({
                    name: p.name,
                    count: p.count,
                    percentage: p.pct,
                }));

                // 4. Transform Treatment Trends
                const treatmentTrends: TrendData[] = trendsData.labels.map((label: string, index: number) => {
                    const trend: TrendData = { month: label };
                    trendsData.series.forEach((s: { name: string; data: (number | null)[] }) => {
                        trend[s.name] = s.data[index] ?? 0;
                    });
                    return trend;
                });
                
                // 5. Transform Experience Timeseries
                const satisfactionSeries = experienceData.series.find((s: any) => s.name === 'Overall Satisfaction');
                const educationSeries = experienceData.series.find((s: any) => s.name === 'Education Effectiveness');

                const satisfactionScores: PatientExperienceData[] = experienceData.labels.map((label: string, index: number) => ({
                    month: label,
                    score: satisfactionSeries ? satisfactionSeries.data[index] : 0,
                })).filter((d: any) => d.score !== null);

                const educationScores: PatientExperienceData[] = experienceData.labels.map((label: string, index: number) => ({
                    month: label,
                    score: educationSeries ? educationSeries.data[index] : 0,
                })).filter((d: any) => d.score !== null);

                // Merge with mock data for missing pieces
                const finalData: DashboardData = {
                    ...DASHBOARD_DATA.Monthly, // Use as a base for missing parts
                    highLevelMetrics,
                    concerns,
                    topProcedures,
                    treatmentTrends,
                    satisfactionScores,
                    educationScores,
                };
                
                setData(finalData);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};
