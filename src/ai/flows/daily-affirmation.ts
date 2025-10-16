
'use server';

/**
 * @fileOverview A Genkit flow for generating a daily affirmation.
 *
 * This flow generates a short, positive affirmation to help users start their day
 * with a positive mindset, supporting multiple languages.
 *
 * @exports {
 *   getDailyAffirmation: (input: DailyAffirmationInput) => Promise<DailyAffirmationOutput>;
 *   DailyAffirmationInput: type
 *   DailyAffirmationOutput: type
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DailyAffirmationInputSchema = z.object({
  language: z.enum(['en', 'ar']).default('en').describe('The language for the affirmation.'),
});

export type DailyAffirmationInput = z.infer<typeof DailyAffirmationInputSchema>;


const DailyAffirmationOutputSchema = z.object({
  affirmation: z
    .string()
    .describe('A short, positive affirmation for the user.'),
});

export type DailyAffirmationOutput = z.infer<
  typeof DailyAffirmationOutputSchema
>;

const dailyAffirmationPrompt = ai.definePrompt({
  name: 'dailyAffirmationPrompt',
  input: {
      schema: DailyAffirmationInputSchema,
  },
  output: {
    schema: DailyAffirmationOutputSchema,
  },
  prompt: `You are an AI assistant that provides short, uplifting daily affirmations.
  Generate one positive affirmation in the following language: {{{language}}}.
  The affirmation should be a single sentence.
  Do not include quotation marks.
  `,
});

const dailyAffirmationFlow = ai.defineFlow(
  {
    name: 'dailyAffirmationFlow',
    inputSchema: DailyAffirmationInputSchema,
    outputSchema: DailyAffirmationOutputSchema,
  },
  async (input) => {
    const {output} = await dailyAffirmationPrompt.generate(input);
    return output!;
  }
);


/**
 * Generates a daily affirmation.
 *
 * @returns A promise that resolves to an object containing the affirmation.
 */
export async function getDailyAffirmation(input: DailyAffirmationInput): Promise<DailyAffirmationOutput> {
  return dailyAffirmationFlow(input);
}
