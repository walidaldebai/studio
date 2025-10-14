
'use server';

/**
 * @fileOverview A Genkit flow for analyzing mood journal entries.
 *
 * This flow takes a series of mood journal entries and provides an
 * insightful summary and analysis of the user's mood patterns.
 *
 * @exports {
 *   analyzeMoodJournal: (input: MoodJournalAnalysisInput) => Promise<MoodJournalAnalysisOutput>;
 *   MoodJournalAnalysisInput: type;
 *   MoodJournalAnalysisOutput: type;
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MoodEntrySchema = z.object({
  date: z.string().describe('The ISO date string of the entry.'),
  mood: z.enum(['Happy', 'Neutral', 'Sad']).describe('The mood recorded for that day.'),
  note: z.string().optional().describe('An optional note provided by the user.'),
});

const MoodJournalAnalysisInputSchema = z.object({
  entries: z.array(MoodEntrySchema).describe('An array of mood journal entries from the last 30 days.'),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the analysis output.'),
});

export type MoodJournalAnalysisInput = z.infer<typeof MoodJournalAnalysisInputSchema>;

const MoodJournalAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A thoughtful and empathetic analysis of the user\'s mood patterns, including potential insights and gentle observations.'),
});

export type MoodJournalAnalysisOutput = z.infer<typeof MoodJournalAnalysisOutputSchema>;

const analysisPrompt = ai.definePrompt({
    name: 'analysisPrompt_moodJournalPage',
    input: {
        schema: MoodJournalAnalysisInputSchema,
    },
    output: {
        schema: MoodJournalAnalysisOutputSchema,
    },
    prompt: `You are an empathetic and insightful AI wellness assistant. Your task is to analyze a user's mood journal entries from the last 30 days and provide a gentle, supportive summary.

    Your response must be in the following language: {{{language}}}.

    Analyze the provided entries to identify patterns, such as frequent moods, correlations between notes and moods, or changes over time. Your tone should be encouraging and non-judgmental.

    If there are very few entries, acknowledge that and suggest the user log their mood more frequently to get richer insights.

    Do not give medical advice. Focus on emotional wellness and self-awareness. Frame your observations as gentle suggestions or things to consider.

    Here are the user's mood entries:
    {{#each entries}}
    - Date: {{date}}, Mood: {{mood}}{{#if note}}, Note: "{{note}}"{{/if}}
    {{/each}}
    `,
});

const analyzeMoodJournalFlow = ai.defineFlow(
    {
        name: 'analyzeMoodJournalFlow_moodJournalPage',
        inputSchema: MoodJournalAnalysisInputSchema,
        outputSchema: MoodJournalAnalysisOutputSchema,
    },
    async (input) => {
        if (input.entries.length < 3) {
            const message = input.language === 'ar'
                ? 'للحصول على تحليل مفيد، حاول تسجيل حالتك المزاجية لبضعة أيام أخرى. كلما زادت البيانات، كانت الأفكار أفضل!'
                : 'For a helpful analysis, try logging your mood for a few more days. The more data, the better the insights!';
            return { analysis: message };
        }
        const { output } = await analysisPrompt(input);
        return output!;
    }
);

export async function analyzeMoodJournal(input: MoodJournalAnalysisInput): Promise<MoodJournalAnalysisOutput> {
    return analyzeMoodJournalFlow(input);
}
