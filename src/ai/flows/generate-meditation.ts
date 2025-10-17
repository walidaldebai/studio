'use server';

/**
 * @fileOverview A Genkit flow for generating guided meditation scripts.
 *
 * This flow creates a unique meditation script based on a chosen theme.
 *
 * @exports {
 *   generateMeditationScript: (input: GenerateMeditationInput) => Promise<GenerateMeditationOutput>;
 *   GenerateMeditationInput: type;
 *   GenerateMeditationOutput: type;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateMeditationInputSchema = z.object({
  theme: z.string().describe('The theme for the meditation, e.g., "Stress Relief", "Focus", "Sleep".'),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the script.'),
});
export type GenerateMeditationInput = z.infer<typeof GenerateMeditationInputSchema>;

const GenerateMeditationOutputSchema = z.object({
  title: z.string().describe('The title of the meditation.'),
  script: z.string().describe('The full guided meditation script, with pauses indicated by "...". The script should be around 200-250 words.'),
});
export type GenerateMeditationOutput = z.infer<typeof GenerateMeditationOutputSchema>;

const generateMeditationFlow = ai.defineFlow(
    {
        name: 'generateMeditationScript',
        inputSchema: GenerateMeditationInputSchema,
        outputSchema: GenerateMeditationOutputSchema,
    },
    async (input) => {
        const prompt = `You are an expert meditation guide. Write a short, calming guided meditation script of about 200-250 words.
        The script should be in the language: ${input.language}.
        The theme is: ${input.theme}.
        
        Start with a title.
        The script must be gentle and soothing.
        Include pauses for reflection, indicated by "...".
        End with a gentle return to awareness.
        Do not use markdown or special formatting in the script.`;

        const llmResponse = await ai.generate({
            prompt: prompt,
            model: 'googleai/gemini-pro',
            output: {
                schema: GenerateMeditationOutputSchema,
            },
        });
        return llmResponse.output!;
    }
);

export async function generateMeditationScript(input: GenerateMeditationInput): Promise<GenerateMeditationOutput> {
    return generateMeditationFlow(input);
}
