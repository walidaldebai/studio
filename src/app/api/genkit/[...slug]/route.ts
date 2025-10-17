import {defineNextHandler} from '@genkit-ai/next';
import {generateAdminDashboardSuggestions} from '@/ai/flows/admin-dashboard-suggestions';
import {analyzeMoodJournal} from '@/ai/flows/analyze-mood-journal';
import {getDailyAffirmation} from '@/ai/flows/daily-affirmation';
import {generateAudioAffirmation} from '@/ai/flows/generate-audio-affirmation';
import {generateLessonIdea} from '@/ai/flows/generate-lesson-idea';
import {generateMeditationScript} from '@/ai/flows/generate-meditation';
import {generateMindfulMoment} from '@/ai/flows/generate-mindful-moment';
import {generatePocketCoachMessage} from '@/ai/flows/generate-pocket-coach-message';
import {getPersonalizedWellnessAdvice} from '@/ai/flows/personalized-wellness-advice';
import {rantChatEmpathy} from '@/ai/flows/rant-chat-empathy';
import {convertTextToSpeech} from '@/ai/flows/text-to-speech';

// IMPORTANT: Do NOT add 'use server' to this file.
// This is a Next.js API route handler, not a Server Action.

export const POST = defineNextHandler({
  flows: [
    generateAdminDashboardSuggestions,
    analyzeMoodJournal,
    getDailyAffirmation,
    generateAudioAffirmation,
    generateLessonIdea,
    generateMeditationScript,
    generateMindfulMoment,
    generatePocketCoachMessage,
    getPersonalizedWellnessAdvice,
    rantChatEmpathy,
    convertTextToSpeech,
  ],
});
