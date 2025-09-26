
import { useState, useEffect } from 'react';
import { Opportunity } from '../types';

const API_BASE = 'https://rag-aesthetic-production.up.railway.app';

interface UseOpportunitiesDataParams {
    type: string;
    day_from: string;
    day_to: string;
}

export const useOpportunitiesData = ({ type, day_from, day_to }: UseOpportunitiesDataParams) => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = new URL(`${API_BASE}/opportunities`);
                url.searchParams.append('type', type);
                url.searchParams.append('day_from', day_from);
                url.searchParams.append('day_to', day_to);

                const response = await fetch(url.toString());

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
    }, [type, day_from, day_to]);

    return { opportunities, loading, error };
};
