import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { KpiData } from '../types';
import { METRICS_API_BASE } from '../config';

const API_BASE = METRICS_API_BASE;

export const useClinicsList = () => {
    const { session, isSuperAdmin } = useAuth();
    const [clinics, setClinics] = useState<string[]>(['All Clinics']);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!session || !isSuperAdmin) {
            setLoading(false);
            setClinics(['All Clinics']);
            return;
        }

        const fetchClinicsFromKpis = async () => {
            setLoading(true);
            setError(null);
            try {
                const today = new Date();
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(today.getFullYear() - 1);
                const formatDate = (date: Date) => date.toISOString().split('T')[0];

                const url = new URL(`${API_BASE}/kpis`);
                url.searchParams.append('from_day', formatDate(oneYearAgo));
                url.searchParams.append('to_day', formatDate(today));
                url.searchParams.append('limit', '365');

                const response = await fetch(url.toString(), {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch clinic list from KPIs');
                }
                
                const kpis: KpiData[] = await response.json();
                if (!Array.isArray(kpis)) {
                    throw new Error('Invalid data format for clinics');
                }

                const uniqueClinics = new Set<string>();
                kpis.forEach(kpi => {
                    if (kpi.clinic) {
                        uniqueClinics.add(kpi.clinic);
                    }
                });
                
                setClinics(['All Clinics', ...Array.from(uniqueClinics).sort()]);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setClinics(['All Clinics']);
            } finally {
                setLoading(false);
            }
        };

        fetchClinicsFromKpis();
    }, [session, isSuperAdmin]);

    return { clinics, loading, error };
};