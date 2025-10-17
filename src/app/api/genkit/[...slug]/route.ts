// IMPORTANT: Do NOT add 'use server' to this file.
// This is a Next.js API route handler, not a Server Action.

import {createGenkitHandler} from '@genkit-ai/next';
import {ai} from '@/ai/genkit';
import '@/ai/flows/admin-dashboard-suggestions';
import '@/ai/flows/analyze-mood-journal';
import '@/ai/flows/daily-affirmation';
import '@/ai/flows/generate-audio-affirmation';
import '@/ai/flows/generate-lesson-idea';
import '@/ai/flows/generate-meditation';
import '@/ai/flows/generate-mindful-moment';
import '@/ai/flows/generate-pocket-coach-message';
import '@/ai/flows/personalized-wellness-advice';
import '@/ai/flows/rant-chat-empathy';
import '@/ai/flows/text-to-speech';

export const {GET, POST} = createGenkitHandler({
  ...ai,
});
