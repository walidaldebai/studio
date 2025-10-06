'use server';

/**
 * @fileOverview A Genkit flow for generating a short, encouraging message.
 *
 * This flow creates a positive message about the theme of making mistakes and self-compassion.
 *
 * @exports {
 *   generatePocketCoachMessage: (input: { language: 'en' | 'ar' }) => Promise<{ message: string }>;
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePocketCoachMessageInputSchema = z.object({
    language: z.enum(['en', 'ar']).default('en').describe('The language for the message.'),
});

export type GeneratePocketCoachMessageInput = z.infer<typeof GeneratePocketCoachMessageInputSchema>;

const GeneratePocketCoachMessageOutputSchema = z.object({
  message: z.string().describe('A short, encouraging message about it being okay to make mistakes. Should be 2-3 sentences.'),
});

export type GeneratePocketCoachMessageOutput = z.infer<typeof GeneratePocketCoachMessageOutputSchema>;

const pocketCoachPrompt = ai.definePrompt({
    name: 'pocketCoachPrompt',
    input: {
        schema: GeneratePocketCoachMessageInputSchema,
    },
    output: {
        schema: GeneratePocketCoachMessageOutputSchema,
    },
    prompt: `You are a kind and wise friend. Generate a short, uplifting pep talk of 2-3 sentences.
    The message should be in the language: {{{language}}}.
    The theme is about embracing imperfections and learning from mistakes.
    Make it sound encouraging and reassuring. Do not use quotation marks.
    The output key should be "message".
    `,
});

const generatePocketCoachMessageFlow = ai.defineFlow(
    {
        name: 'generatePocketCoachMessageFlow',
        inputSchema: GeneratePocketCoachMessageInputSchema,
        outputSchema: GeneratePocketCoachMessageOutputSchema,
    },
    async (input) => {
        const { output } = await pocketCoachPrompt(input);
        return output!;
    }
);


export async function generatePocketCoachMessage(input: GeneratePocketCoachMessageInput): Promise<GeneratePocketCoachMessageOutput> {
    return generatePocketCoachMessageFlow(input);
}
