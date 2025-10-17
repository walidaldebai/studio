'use server';

/**
 * @fileOverview A Genkit flow for generating a short, mindful moment script.
 *
 * This flow creates a calming script for a brief mindfulness exercise.
 *
 * @exports {
 *   generateMindfulMoment: (input: GenerateMindfulMomentInput) => Promise<GenerateMindfulMomentOutput>;
 *   GenerateMindfulMomentInput: type;
 *   GenerateMindfulMomentOutput: type;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateMindfulMomentInputSchema = z.object({
    language: z.enum(['en', 'ar']).default('en').describe('The language for the script.'),
});
export type GenerateMindfulMomentInput = z.infer<typeof GenerateMindfulMomentInputSchema>;

const GenerateMindfulMomentOutputSchema = z.object({
  moment: z.string().describe('A short script for a guided mindful moment, around 60-90 seconds long. It should guide the user through a simple awareness exercise.'),
});
export type GenerateMindfulMomentOutput = z.infer<typeof GenerateMindfulMomentOutputSchema>;

const generateMindfulMomentFlow = ai.defineFlow(
    {
        name: 'generateMindfulMoment',
        inputSchema: GenerateMindfulMomentInputSchema,
        outputSchema: GenerateMindfulMomentOutputSchema,
    },
    async (input) => {
        const prompt = `You are a calm and reassuring mindfulness guide. Generate a short script for a guided "Mindful Moment" of about 60-90 seconds.
        The script should be in the language: ${input.language}.
        The theme is about finding a brief moment of peace and awareness in the present.
        Focus on a simple practice, like a body scan, noticing sounds, or focusing on the breath.
        Your tone should be gentle and inviting.
        Do not use quotation marks.
        The output key should be "moment".`;

        const llmResponse = await ai.generate({
            prompt: prompt,
            model: 'googleai/gemini-pro',
            output: {
                schema: GenerateMindfulMomentOutputSchema,
            },
        });
        return llmResponse.output!;
    }
);

export async function generateMindfulMoment(input: GenerateMindfulMomentInput): Promise<GenerateMindfulMomentOutput> {
    return generateMindfulMomentFlow(input);
}
