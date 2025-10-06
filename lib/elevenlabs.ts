import { ELEVENLABS_API_KEY as apiKey } from '../config';


// NOTE: This requires the ELEVENLABS_API_KEY to be set in config.ts.
const ELEVENLABS_API_KEY = apiKey;
// A standard, high-quality voice (Rachel) suitable for a professional setting.
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

/**
 * Generates audio from text using the ElevenLabs API and plays it.
 * @param text The text to convert to speech.
 * @returns A promise that resolves when the audio has finished playing, or rejects on error.
 */
export const generateAndPlayAudio = (text: string): Promise<void> => {
  if (!ELEVENLABS_API_KEY) {
    console.warn("ElevenLabs API key not found in config.ts. Skipping audio playback.");
    // Resolve immediately to not block the simulation if the key is missing.
    return Promise.resolve();
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const headers = {
    'Accept': 'audio/mpeg',
    'Content-Type': 'application/json',
    'xi-api-key': ELEVENLABS_API_KEY,
  };
  const body = JSON.stringify({
    text: text,
    model_id: 'eleven_multilingual_v2', // Using a multilingual model for better compatibility
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
    },
  });

  return new Promise((resolve, reject) => {
    fetch(url, { method: 'POST', headers, body })
      .then(response => {
        if (!response.ok) {
          // Try to get more detailed error from ElevenLabs response
          return response.json().then(err => {
            throw new Error(err.detail?.message || `API request failed with status ${response.status}`);
          });
        }
        return response.blob();
      })
      .then(blob => {
        const audio = new Audio(URL.createObjectURL(blob));
        
        audio.onended = () => {
          URL.revokeObjectURL(audio.src); // Clean up to prevent memory leaks
          resolve();
        };

        audio.onerror = (e) => {
          URL.revokeObjectURL(audio.src);
          console.error("Audio playback error:", e);
          reject(new Error("Error playing audio."));
        };

        audio.play().catch(e => {
          console.error("Audio playback failed (e.g., autoplay blocked):", e);
          // If play fails, we still resolve to not block the simulation,
          // but the user won't hear anything.
          resolve();
        });
      })
      .catch(error => {
        console.error("Error with ElevenLabs API:", error);
        // Rejecting here will be caught by the calling function.
        reject(error);
      });
  });
};
