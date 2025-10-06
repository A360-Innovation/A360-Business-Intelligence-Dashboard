import { useState, useEffect } from 'react';
import { DashboardData, HighLevelMetric, Concern, Procedure, TrendData, PatientExperienceData } from '../types';
import { DASHBOARD_DATA } from '../constants';

const API_BASE = 'https://rag-aesthetic-production.up.railway.app/metrics';

interface UseDashboardDataProps {
    startDate: string;
    endDate: string;
}

export const useDashboardData = ({ startDate, endDate }: UseDashboardDataProps) => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!startDate || !endDate) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const queryParams = `?start_date=${startDate}&end_date=${endDate}`;

                const [
                    summaryRes,
                    concernsRes,
                    topProceduresRes,
                    trendsRes,
                    experienceRes,
                ] = await Promise.all([
                    fetch(`${API_BASE}/summary${queryParams}`),
                    fetch(`${API_BASE}/concerns${queryParams}`),
                    fetch(`${API_BASE}/top_procedures${queryParams}`),
                    fetch(`${API_BASE}/treatment_trends${queryParams}`),
                    fetch(`${API_BASE}/experience_timeseries${queryParams}`),
                ]);

                const allResponses = [summaryRes, concernsRes, topProceduresRes, trendsRes, experienceRes];
                const errorResponses = allResponses.filter(r => !r.ok);

                if (errorResponses.length > 0) {
                     const errorDetails = await Promise.all(errorResponses.map(async r => {
                        const text = await r.text();
                        return `${r.url.split('?')[0].split('/').pop()} -> ${r.statusText} (${r.status}): ${text.slice(0, 100)}`;
                    }));
                    throw new Error(`Failed to fetch dashboard data.\n- ${errorDetails.join('\n- ')}`);
                }
                
                const summaryData = await summaryRes.json();
                const concernsData = await concernsRes.json();
                const topProceduresData = await topProceduresRes.json();
                const trendsData = await trendsRes.json();
                const experienceData = await experienceRes.json();

                // 1. Transform Summary -> highLevelMetrics
                const highLevelMetrics: HighLevelMetric[] = [
                    { title: "Total Transcripts", value: String(summaryData.total_transcripts), subtitle: "Consultations analyzed", icon: "FileText" },
                    { title: "Overall Satisfaction Score", value: `${summaryData.overall_satisfaction_pct}%`, subtitle: "Avg. patient feedback", icon: "Smile" },
                    { title: "Education Effectiveness", value: `${summaryData.education_effectiveness_pct}%`, subtitle: "Patient comprehension", icon: "BookOpen" },
                    { 
                        title: "Top Procedures Recommended", 
                        value: summaryData.top_procedures.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(', '), 
                        subtitle: "Most frequent recommendations", 
                        icon: "TrendingUp" 
                    },
                ];

                // 2. Transform Concerns
                const totalConcernsCount = concernsData.reduce((sum: number, c: { count: number }) => sum + c.count, 0);
                const concerns: Concern[] = concernsData.map((c: { label: string; count: number }) => ({
                    name: c.label.charAt(0).toUpperCase() + c.label.slice(1),
                    value: totalConcernsCount > 0 ? Math.round((c.count / totalConcernsCount) * 100) : 0,
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

                // 5. Transform Patient Experience
                const satisfactionSeries = experienceData.series.find((s: any) => s.name === 'Overall Satisfaction');
                const educationSeries = experienceData.series.find((s: any) => s.name === 'Education Effectiveness');

                const satisfactionScores: PatientExperienceData[] = satisfactionSeries ? experienceData.labels.map((month: string, index: number) => ({
                    month,
                    score: satisfactionSeries.data[index] ?? 0,
                })) : [];
                
                const educationScores: PatientExperienceData[] = educationSeries ? experienceData.labels.map((month: string, index: number) => ({
                    month,
                    score: educationSeries.data[index] ?? 0,
                })) : [];
                
                // Merge with mock data for components that don't have an API yet
                const finalData: DashboardData = {
                    ...DASHBOARD_DATA.Monthly,
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
    }, [startDate, endDate]);

    return { data, loading, error };
};