


import { useState, useEffect } from 'react';
import { Opportunity } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { METRICS_API_BASE } from '../config';

const API_BASE = METRICS_API_BASE;

interface UseOpportunitiesDataParams {
    type: string;
    day_from: string;
    day_to: string;
    clinic: string;
}

export const useOpportunitiesData = ({ type, day_from, day_to, clinic }: UseOpportunitiesDataParams) => {
    const { session } = useAuth();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!session) {
            setLoading(false);
            return;
        }

        const fetchOpportunities = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = new URL(`${API_BASE}/opportunities`);
                url.searchParams.append('type', type);
                url.searchParams.append('day_from', day_from);
                url.searchParams.append('day_to', day_to);
                if (clinic && clinic !== 'All Clinics') {
                    url.searchParams.append('clinic', clinic);
                }

                const response = await fetch(url.toString(), {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch opportunities. Status: ${response.statusText}`);
                }
                
                const data: Opportunity[] = await response.json();
                setOpportunities(data);

            } catch (err) {
                 if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                console.error("Failed to fetch opportunities data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, [type, day_from, day_to, clinic, session]);

    return { opportunities, loading, error };
};