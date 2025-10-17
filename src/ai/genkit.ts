'use server';

/**
 * @fileOverview This file initializes the Genkit AI instance.
 * It is crucial for this file to exist and be correctly configured for any AI functionality to work.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Initialize the Genkit instance with the Google AI plugin.
// The API key is sourced from environment variables for security.
// This `ai` instance is exported and used across all AI flows to define and run them.
export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
