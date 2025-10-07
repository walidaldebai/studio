'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-wellness-advice.ts';
import '@/ai/flows/rant-chat-empathy.ts';
import '@/ai/flows/admin-dashboard-suggestions.ts';
import '@/ai/flows/daily-affirmation.ts';
import '@/ai/flows/generate-meditation.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/generate-audio-affirmation.ts';
import '@/ai/flows/generate-mindful-moment.ts';
