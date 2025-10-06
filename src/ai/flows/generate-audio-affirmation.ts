'use server';

/**
 * @fileOverview A Genkit flow for generating spoken audio affirmations.
 *
 * This flow creates a unique affirmation script based on a chosen theme.
 *
 * @exports {
 *   generateAudioAffirmation: (input: GenerateAudioAffirmationInput) => Promise<GenerateAudioAffirmationOutput>;
 *   GenerateAudioAffirmationInput: type
 *   GenerateAudioAffirmationOutput: type
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAudioAffirmationInputSchema = z.object({
  theme: z.string().describe('The theme for the affirmation, e.g., "Self-Compassion", "Finding Joy".'),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the script.'),
});

export type GenerateAudioAffirmationInput = z.infer<typeof GenerateAudioAffirmationInputSchema>;

const GenerateAudioAffirmationOutputSchema = z.object({
  title: z.string().describe('The title of the affirmation session.'),
  script: z.string().describe('The full affirmation script, with pauses indicated by "...". The script should be around 200 words.'),
});

export type GenerateAudioAffirmationOutput = z.infer<typeof GenerateAudioAffirmationOutputSchema>;

const affirmationPrompt = ai.definePrompt({
    name: 'affirmationPrompt',
    input: {
        schema: GenerateAudioAffirmationInputSchema,
    },
    output: {
        schema: GenerateAudioAffirmationOutputSchema,
    },
    prompt: `You are an expert in positive psychology and a compassionate guide. Write a short, uplifting audio affirmation script of about 200 words.
    The script should be in the language: {{{language}}}.
    The theme is: {{{theme}}}.
    
    Start with a title.
    The script must be gentle, reassuring, and empowering.
    Include pauses for reflection, indicated by "...".
    End with a positive concluding thought.
    Do not use markdown or special formatting in the script.
    `,
});

const generateAudioAffirmationFlow = ai.defineFlow(
    {
        name: 'generateAudioAffirmationFlow',
        inputSchema: GenerateAudioAffirmationInputSchema,
        outputSchema: GenerateAudioAffirmationOutputSchema,
    },
    async (input) => {
        const { output } = await affirmationPrompt(input);
        return output!;
    }
);


export async function generateAudioAffirmation(input: GenerateAudioAffirmationInput): Promise<GenerateAudioAffirmationOutput> {
    return generateAudioAffirmationFlow(input);
}
