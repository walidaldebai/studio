import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {getApiKey} from '@/lib/server-utils';

export const ai = genkit({
  plugins: [googleAI({apiKey: getApiKey('GEMINI_API_KEY')})],
  model: 'googleai/gemini-2.5-flash',
});
