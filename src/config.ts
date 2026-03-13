// Centralized configuration for environment variables and API keys.
// In a production build process, these values would typically be injected
// from environment variables (e.g., using Vite's import.meta.env).

// Supabase Configuration (safe to be public)
export const SUPABASE_URL = 'https://gjnumzwkahtlvaliwljm.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqbnVtendrYWh0bHZhbGl3bGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NjY4MTMsImV4cCI6MjA3NDI0MjgxM30.qcDqrECyP5fJXikEpQNwf_L51RkM8Qebr-dF0F8Qlg8';

// ElevenLabs Configuration (should be kept secure in a real application)
// For this demo, it's left empty. Provide your key here to enable voice generation.
export const ELEVENLABS_API_KEY = '';

// API Base URLs
// In production, these should be set via environment variables.
export const METRICS_API_BASE = 'https://rag-aesthetic-production.up.railway.app';
export const CHAT_API_BASE = 'https://chat-stream-production.up.railway.app';

// The Gemini API Key is handled separately via `process.env.API_KEY`
// as per the project's execution environment setup.
