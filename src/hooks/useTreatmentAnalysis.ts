'use client';

import { useState, useEffect } from 'react';
import { TreatmentAnalysisData, TreatmentObjection, TreatmentCrossSell, TreatmentEducationData } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { METRICS_API_BASE } from '../config';

const API_BASE = `${METRICS_API_BASE}/treatments`;

export const useTreatmentAnalysis = (treatmentName: string | null, clinicName: string | null, startDate: string, endDate: string) => {
    const { session } = useAuth();
    const [analysisData, setAnalysisData] = useState<TreatmentAnalysisData | null>(null);
    const [educationData, setEducationData] = useState<TreatmentEducationData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!treatmentName || !session || !startDate || !endDate) {
            setAnalysisData(null);
            setEducationData(null);
            if (!session) setLoading(false);
            return;
        }

        const fetchAnalysisData = async () => {
            setLoading(true);
            setError(null);
            
            const encodedTreatment = encodeURIComponent(treatmentName.toLowerCase());

            try {
                const headers = { 'Authorization': `Bearer ${session.access_token}` };
                let queryParams = `?start_date=${startDate}&end_date=${endDate}`;
                if (clinicName && clinicName !== 'All Clinics') {
                    queryParams += `&clinic=${encodeURIComponent(clinicName)}`;
                }

                const endpoints = {
                    analysis: `${API_BASE}/${encodedTreatment}/analysis${queryParams}`,
                    objections: `${API_BASE}/${encodedTreatment}/objections${queryParams}`,
                    crossSell: `${API_BASE}/${encodedTreatment}/cross-sell${queryParams}`,
                    demographics: `${API_BASE}/${encodedTreatment}/demographics${queryParams}`,
                    education: `${API_BASE}/${encodedTreatment}/education-effectiveness${queryParams}`,
                };

                const [
                    analysisRes,
                    objectionsRes,
                    crossSellRes,
                    demographicsRes,
                    educationRes
                ] = await Promise.all([
                    fetch(endpoints.analysis, { headers }),
                    fetch(endpoints.objections, { headers }),
                    fetch(endpoints.crossSell, { headers }),
                    fetch(endpoints.demographics, { headers }),
                    fetch(endpoints.education, { headers }),
                ]);

                const allResponses = [analysisRes, objectionsRes, crossSellRes, demographicsRes, educationRes];
                const errorResponses = allResponses.filter(r => !r.ok);
                if (errorResponses.length > 0) {
                     const errorDetails = await Promise.all(errorResponses.map(async r => {
                        const text = await r.text();
                        return `${r.url.split('?')[0].split('/').pop()} -> ${r.statusText} (${r.status}): ${text.slice(0, 100)}`;
                    }));
                    throw new Error(`Failed to fetch some analysis data.\n- ${errorDetails.join('\n- ')}`);
                }

                const analysisJSON = await analysisRes.json();
                const objectionsJSON = await objectionsRes.json();
                const crossSellJSON = await crossSellRes.json();
                const demographicsJSON = await demographicsRes.json();
                const educationJSON = await educationRes.json();

                // Transform analysis data
                const consolidatedAnalysisData: TreatmentAnalysisData = {
                    keyMetrics: [
                        { title: "Recommendations", value: String(analysisJSON.recommendations) },
                        { title: "Target Age Group", value: analysisJSON.target_age_group },
                        { title: "Avg. Satisfaction", value: `${analysisJSON.avg_satisfaction_pct}%` },
                        { title: "Conversion Rate", value: "82%" }, // Static for now as not in API
                    ],
                    objections: objectionsJSON.objections.map((o: { type: string; description: string; frequency?: number }): TreatmentObjection => ({
                        title: o.type,
                        description: o.description,
                        frequency: o.frequency,
                    })),
                    crossSell: crossSellJSON.cross_sell_opportunities.map((cs: { procedure: string; description: string; frequency?: number }): TreatmentCrossSell => ({
                        name: cs.procedure,
                        rationale: cs.description,
                        frequency: cs.frequency,
                    })),
                    demographics: {
                        total_patients: demographicsJSON.total_patients,
                        age_distribution: demographicsJSON.age_distribution,
                    },
                };
                
                setAnalysisData(consolidatedAnalysisData);
                setEducationData(educationJSON);

            } catch (err) {
                 if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred while fetching analysis data.');
                }
                console.error("Failed to fetch treatment analysis data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysisData();
    }, [treatmentName, clinicName, startDate, endDate, session]);

    return { analysisData, educationData, loading, error };
};
