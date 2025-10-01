'use server';

/**
 * @fileOverview A Genkit flow for generating a daily affirmation.
 *
 * This flow generates a short, positive affirmation to help users start their day
 * with a positive mindset.
 *
 * @exports {
 *   getDailyAffirmation: () => Promise<DailyAffirmationOutput>;
 *   DailyAffirmationOutput: type
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// No input schema needed for this flow

const DailyAffirmationOutputSchema = z.object({
  affirmation: z
    .string()
    .describe('A short, positive affirmation for the user.'),
});

export type DailyAffirmationOutput = z.infer<
  typeof DailyAffirmationOutputSchema
>;

const dailyAffirmationFlow = ai.defineFlow(
  {
    name: 'dailyAffirmationFlow',
    outputSchema: DailyAffirmationOutputSchema,
  },
  async () => {
    const {output} = await dailyAffirmationPrompt({});
    return output!;
  }
);

const dailyAffirmationPrompt = ai.definePrompt({
  name: 'dailyAffirmationPrompt',
  output: {
    schema: DailyAffirmationOutputSchema,
  },
  prompt: `You are an AI assistant that provides short, uplifting daily affirmations.
  Generate one positive affirmation. The affirmation should be a single sentence.
  Do not include quotation marks.
  `,
});

/**
 * Generates a daily affirmation.
 *
 * @returns A promise that resolves to an object containing the affirmation.
 */
export async function getDailyAffirmation(): Promise<DailyAffirmationOutput> {
  return dailyAffirmationFlow();
}
