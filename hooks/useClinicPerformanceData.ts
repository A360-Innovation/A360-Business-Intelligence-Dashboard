


import { useState, useEffect } from 'react';
import { KpiData, ClinicPerformanceData } from '../types';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'https://rag-aesthetic-production.up.railway.app';

interface UseClinicPerformanceDataParams {
    from_day: string;
    to_day: string;
    clinic: string;
}

export const useClinicPerformanceData = ({ from_day, to_day, clinic }: UseClinicPerformanceDataParams) => {
    const { session } = useAuth();
    const [performanceData, setPerformanceData] = useState<ClinicPerformanceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!from_day || !to_day || !session) {
            if (!session) setLoading(false);
            return;
        }

        const fetchPerformanceData = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = new URL(`${API_BASE}/kpis`);
                url.searchParams.append('from_day', from_day);
                url.searchParams.append('to_day', to_day);
                url.searchParams.append('limit', '365'); // Fetch enough data for the range
                
                if (clinic && clinic !== 'All Clinics') {
                    url.searchParams.append('clinic', clinic);
                }

                const response = await fetch(url.toString(), {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch KPI data. Status: ${response.statusText}`);
                }
                
                const kpis: KpiData[] = await response.json();

                if (!Array.isArray(kpis)) {
                    throw new Error('Invalid data format received from API.');
                }

                // Aggregate data by clinic
                const aggregation: { [key: string]: {
                    totalConsultations: number;
                    totalObjections: number;
                    weightedSatisfactionSum: number;
                    satisfactionWeight: number;
                    weightedEducationSum: number;
                    educationWeight: number;
                } } = {};

                for (const kpi of kpis) {
                    if (!kpi.clinic) continue;
                    const clinicName = kpi.clinic;

                    if (!aggregation[clinicName]) {
                        aggregation[clinicName] = {
                            totalConsultations: 0,
                            totalObjections: 0,
                            weightedSatisfactionSum: 0,
                            satisfactionWeight: 0,
                            weightedEducationSum: 0,
                            educationWeight: 0,
                        };
                    }

                    aggregation[clinicName].totalConsultations += kpi.transcripts_count;
                    aggregation[clinicName].totalObjections += kpi.objections_count || 0;

                    if (kpi.avg_satisfaction !== null && kpi.avg_satisfaction !== undefined) {
                        aggregation[clinicName].weightedSatisfactionSum += kpi.avg_satisfaction * kpi.transcripts_count;
                        aggregation[clinicName].satisfactionWeight += kpi.transcripts_count;
                    }
                    if (kpi.avg_education_effectiveness !== null && kpi.avg_education_effectiveness !== undefined) {
                        aggregation[clinicName].weightedEducationSum += kpi.avg_education_effectiveness * kpi.transcripts_count;
                        aggregation[clinicName].educationWeight += kpi.transcripts_count;
                    }
                }

                const finalData: ClinicPerformanceData[] = Object.keys(aggregation).map(clinicName => {
                    const clinicData = aggregation[clinicName];
                    return {
                        clinicName,
                        totalConsultations: clinicData.totalConsultations,
                        totalObjections: clinicData.totalObjections,
                        avgSatisfaction: clinicData.satisfactionWeight > 0 ? clinicData.weightedSatisfactionSum / clinicData.satisfactionWeight : null,
                        avgEducation: clinicData.educationWeight > 0 ? clinicData.weightedEducationSum / clinicData.educationWeight : null,
                    };
                });
                
                setPerformanceData(finalData);

            } catch (err) {
                 if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                console.error("Failed to fetch clinic performance data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceData();
    }, [from_day, to_day, clinic, session]);

    return { performanceData, loading, error };
};