
/**
 * @fileOverview This file initializes the Genkit AI instance.
 * It is crucial for this file to exist and be correctly configured for any AI functionality to work.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// This is the main AI instance that will be used throughout the app.
// It is initialized here and then exported for use in all AI flows.
export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
