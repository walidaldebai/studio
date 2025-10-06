'use server';

/**
 * @fileOverview A Genkit flow for analyzing a user's mood journal entries.
 *
 * This flow takes a history of mood entries and provides a compassionate,
 * insightful summary to help the user identify patterns and reflect on their well-being.
 *
 * @exports {
 *   analyzeMoodJournal: (input: MoodJournalAnalysisInput) => Promise<MoodJournalAnalysisOutput>;
 *   MoodJournalAnalysisInput: type
 *   MoodJournalAnalysisOutput: type
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MoodEntrySchema = z.object({
    date: z.string().describe("The ISO date string of the entry."),
    mood: z.enum(['Happy', 'Neutral', 'Sad']).describe("The user's mood."),
    note: z.string().optional().describe("An optional note from the user."),
});

const MoodJournalAnalysisInputSchema = z.object({
  entries: z.array(MoodEntrySchema).describe("An array of the user's mood journal entries."),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the analysis.'),
});

export type MoodJournalAnalysisInput = z.infer<typeof MoodJournalAnalysisInputSchema>;

const MoodJournalAnalysisOutputSchema = z.object({
  analysis: z.string().describe("A compassionate and insightful analysis of the user's mood patterns."),
});

export type MoodJournalAnalysisOutput = z.infer<typeof MoodJournalAnalysisOutputSchema>;

const analysisPrompt = ai.definePrompt({
    name: 'analysisPrompt',
    input: {
        schema: MoodJournalAnalysisInputSchema,
    },
    output: {
        schema: MoodJournalAnalysisOutputSchema,
    },
    prompt: `You are a compassionate and insightful AI wellness assistant. Your role is to analyze a user's mood journal entries and provide a gentle, supportive, and constructive summary. Your tone should be encouraging, not clinical.

    Analyze the following mood journal entries provided in JSON format. The user's language is {{{language}}}.
    
    - Identify trends or patterns. For example, do their moods change on weekends vs. weekdays?
    - If there are notes, gently refer to potential themes you see. For example, "It seems that 'work' was mentioned on days you felt sad."
    - Highlight positive streaks. For example, "It's great to see you had a series of happy days last week."
    - Offer a reflective and forward-looking concluding thought. Avoid giving prescriptive advice.
    - Keep the analysis concise, around 3-4 paragraphs.
    - Address the user in the second person (e.g., "You seem to...").

    Here are the user's mood entries:
    {{{json entries}}}
    `,
});

const analyzeMoodJournalFlow = ai.defineFlow(
    {
        name: 'analyzeMoodJournalFlow',
        inputSchema: MoodJournalAnalysisInputSchema,
        outputSchema: MoodJournalAnalysisOutputSchema,
    },
    async (input) => {
        if (input.entries.length < 3) {
            const message = input.language === 'ar' 
                ? 'لا توجد بيانات كافية حتى الآن. استمر في تسجيل مزاجك لبضعة أيام أخرى للحصول على تحليل.' 
                : 'There isn\'t enough data yet. Keep logging your mood for a few more days to get an analysis.';
            return { analysis: message };
        }
        const { output } = await analysisPrompt(input);
        return output!;
    }
);


export async function analyzeMoodJournal(input: MoodJournalAnalysisInput): Promise<MoodJournalAnalysisOutput> {
    return analyzeMoodJournalFlow(input);
}
