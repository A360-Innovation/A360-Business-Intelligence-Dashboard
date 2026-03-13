'use client';



import { useState, useEffect } from 'react';
import { KpiData } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { METRICS_API_BASE } from '../config';

const API_BASE = METRICS_API_BASE;

interface UseKpisDataParams {
    from_day: string;
    to_day: string;
    clinic: string;
    limit?: number;
}

export const useKpisData = ({ from_day, to_day, clinic, limit = 90 }: UseKpisDataParams) => {
    const { session } = useAuth();
    const [kpis, setKpis] = useState<KpiData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!from_day || !to_day || !session) {
            if (!session) setLoading(false);
            return;
        }

        const fetchKpis = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = new URL(`${API_BASE}/kpis`);
                url.searchParams.append('from_day', from_day);
                url.searchParams.append('to_day', to_day);
                url.searchParams.append('limit', String(limit));

                if (clinic && clinic !== 'All Clinics') {
                    url.searchParams.append('clinic', clinic);
                }

                const response = await fetch(url.toString(), {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch KPIs. Status: ${response.statusText}`);
                }
                
                const data: KpiData[] = await response.json();
                // Sort data by day descending
                data.sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime());
                setKpis(data);

            } catch (err) {
                 if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                console.error("Failed to fetch KPIs data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchKpis();
    }, [from_day, to_day, clinic, limit, session]);

    return { kpis, loading, error };
};