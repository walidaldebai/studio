'use server';

/**
 * @fileOverview A Genkit flow for generating a daily affirmation.
 * This flow generates a short, positive affirmation in the user's chosen language.
 *
 * @exports {
 *   getDailyAffirmation: (input: DailyAffirmationInput) => Promise<DailyAffirmationOutput>;
 *   DailyAffirmationInput: type;
 *   DailyAffirmationOutput: type;
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
export type DailyAffirmationOutput = z.infer<typeof DailyAffirmationOutputSchema>;

const dailyAffirmationFlow = ai.defineFlow(
  {
    name: 'getDailyAffirmation',
    inputSchema: DailyAffirmationInputSchema,
    outputSchema: DailyAffirmationOutputSchema,
  },
  async (input) => {
    const prompt = `You are an AI assistant that provides short, uplifting daily affirmations.
    Generate one positive affirmation in the following language: ${input.language}.
    The affirmation should be a single sentence.
    Do not include quotation marks.`;

    const llmResponse = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-pro',
        output: {
            schema: DailyAffirmationOutputSchema
        }
    });
    return llmResponse.output!;
  }
);

/**
 * Generates a daily affirmation.
 * @param input - The input object containing the desired language.
 * @returns A promise that resolves to an object containing the affirmation.
 */
export async function getDailyAffirmation(input: DailyAffirmationInput): Promise<DailyAffirmationOutput> {
  return dailyAffirmationFlow(input);
}
