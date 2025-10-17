'use server';

/**
 * @fileOverview This file initializes the Genkit AI instance.
 * It is crucial for this file to exist and be correctly configured for any AI functionality to work.
 */

import {genkit} from 'genkit';
import {configureGenkit} from 'genkit/config';
import {googleAI} from '@genkit-ai/google-genai';

// This is the main AI instance that will be used throughout the app.
export const ai = genkit();

// Initialize the Genkit instance with the Google AI plugin.
// The API key is sourced from environment variables for security.
// This `ai` instance is exported and used across all AI flows to define and run them.
configureGenkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
