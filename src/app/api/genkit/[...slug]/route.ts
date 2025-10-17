
'use server';
import {defineNextHandler} from '@genkit-ai/next';
import * as adminDashboardSuggestions from '@/ai/flows/admin-dashboard-suggestions';
import * as analyzeMoodJournal from '@/ai/flows/analyze-mood-journal';
import * as dailyAffirmation from '@/ai/flows/daily-affirmation';
import * as generateAudioAffirmation from '@/ai/flows/generate-audio-affirmation';
import * as generateLessonIdea from '@/ai/flows/generate-lesson-idea';
import * as generateMeditation from '@/ai/flows/generate-meditation';
import * as generateMindfulMoment from '@/ai/flows/generate-mindful-moment';
import * as generatePocketCoachMessage from '@/ai/flows/generate-pocket-coach-message';
import * as personalizedWellnessAdvice from '@/ai/flows/personalized-wellness-advice';
import * as rantChatEmpathy from '@/ai/flows/rant-chat-empathy';
import * as textToSpeech from '@/ai/flows/text-to-speech';

export const POST = defineNextHandler({
  flows: [
    adminDashboardSuggestions.generateAdminDashboardSuggestions,
    analyzeMoodJournal.analyzeMoodJournal,
    dailyAffirmation.getDailyAffirmation,
    generateAudioAffirmation.generateAudioAffirmation,
    generateLessonIdea.generateLessonIdea,
    generateMeditation.generateMeditationScript,
    generateMindfulMoment.generateMindfulMoment,
    generatePocketCoachMessage.generatePocketCoachMessage,
    personalizedWellnessAdvice.getPersonalizedWellnessAdvice,
    rantChatEmpathy.rantChatEmpathy,
    textToSpeech.convertTextToSpeech,
  ],
});
