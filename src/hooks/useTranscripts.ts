'use client';

import { useState, useEffect, useCallback } from 'react';
import { TranscriptSummary, TranscriptDetail } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CHAT_API_BASE } from '../config';

const API_BASE = CHAT_API_BASE;

interface UseTranscriptsParams {
    date_from?: string;
    date_to?: string;
    clinic?: string;
    satisfaction_min?: number;
    procedure?: string;
    limit?: number;
    offset?: number;
}

export const useTranscripts = (params: UseTranscriptsParams) => {
    const { session } = useAuth();
    const [transcripts, setTranscripts] = useState<TranscriptSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);

    const fetchTranscripts = useCallback(async () => {
        if (!session) return;
        
        setLoading(true);
        setError(null);
        try {
            const url = new URL(`${API_BASE}/transcripts`);
            if (params.date_from) url.searchParams.append('date_from', params.date_from);
            if (params.date_to) url.searchParams.append('date_to', params.date_to);
            if (params.clinic && params.clinic !== 'All Clinics') url.searchParams.append('clinic', params.clinic);
            if (params.satisfaction_min) url.searchParams.append('satisfaction_min', String(params.satisfaction_min));
            if (params.procedure) url.searchParams.append('procedure', params.procedure);
            if (params.limit !== undefined) url.searchParams.append('limit', String(params.limit));
            if (params.offset !== undefined) url.searchParams.append('offset', String(params.offset));

            const response = await fetch(url.toString(), {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transcripts list');
            }

            const data = await response.json();
            setTranscripts(data.transcripts || []);
            setTotal(data.total || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [session, JSON.stringify(params)]);

    useEffect(() => {
        fetchTranscripts();
    }, [fetchTranscripts]);

    return { transcripts, total, loading, error, refetch: fetchTranscripts };
};

export const useTranscriptDetail = (transcriptId: string | null) => {
    const { session } = useAuth();
    const [detail, setDetail] = useState<TranscriptDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!transcriptId || !session) {
            setDetail(null);
            return;
        }

        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE}/transcripts/${transcriptId}?include_messages=true`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch transcript detail');
                }

                const data = await response.json();
                setDetail(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [transcriptId, session]);

    return { detail, loading, error };
};

export const useTranscriptChat = (transcriptId: string | null) => {
    const { session } = useAuth();
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const sendMessage = async (message: string) => {
        if (!transcriptId || !session) return;

        // Optimistic update
        const userMsg = { role: 'user' as const, content: message };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/transcripts/${transcriptId}/chat`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}` 
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            const modelMsg = { role: 'model' as const, content: data.answer };
            setMessages(prev => [...prev, modelMsg]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error processing your request.' }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => setMessages([]);

    return { messages, loading, sendMessage, clearChat };
};
