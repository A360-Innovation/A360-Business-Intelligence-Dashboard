


import { useState, useEffect } from 'react';
import { Feedback } from '../types';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'https://rag-aesthetic-production.up.railway.app';

interface UseFeedbackDataParams {
    start_date: string;
    end_date: string;
    clinic: string;
}

export const useFeedbackData = ({ start_date, end_date, clinic }: UseFeedbackDataParams) => {
    const { session } = useAuth();
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!start_date || !end_date || !session) {
            if (!session) setLoading(false);
            return;
        }

        const fetchFeedback = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = new URL(`${API_BASE}/feedback`);
                url.searchParams.append('start_date', start_date);
                url.searchParams.append('end_date', end_date);

                if (clinic && clinic !== 'All Clinics') {
                    url.searchParams.append('clinic', clinic);
                }

                const response = await fetch(url.toString(), {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch feedback. Status: ${response.statusText}`);
                }
                
                const data: Feedback[] = await response.json();
                setFeedback(data);

            } catch (err) {
                 if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                console.error("Failed to fetch feedback data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [start_date, end_date, clinic, session]);

    return { feedback, loading, error };
};