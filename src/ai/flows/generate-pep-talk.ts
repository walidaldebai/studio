'use server';

/**
 * @fileOverview A Genkit flow for generating a short, encouraging pep talk.
 *
 * This flow creates a positive message about the theme of making mistakes and self-compassion.
 *
 * @exports {
 *   generatePepTalk: (input: { language: 'en' | 'ar' }) => Promise<{ pepTalk: string }>;
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePepTalkInputSchema = z.object({
    language: z.enum(['en', 'ar']).default('en').describe('The language for the pep talk.'),
});

export type GeneratePepTalkInput = z.infer<typeof GeneratePepTalkInputSchema>;

const GeneratePepTalkOutputSchema = z.object({
  pepTalk: z.string().describe('A short, encouraging pep talk about it being okay to make mistakes. Should be 2-3 sentences.'),
});

export type GeneratePepTalkOutput = z.infer<typeof GeneratePepTalkOutputSchema>;

const pepTalkPrompt = ai.definePrompt({
    name: 'pepTalkPrompt',
    input: {
        schema: GeneratePepTalkInputSchema,
    },
    output: {
        schema: GeneratePepTalkOutputSchema,
    },
    prompt: `You are a kind and wise friend. Generate a short, uplifting pep talk of 2-3 sentences.
    The message should be in the language: {{{language}}}.
    The theme is about embracing imperfections and learning from mistakes.
    Make it sound encouraging and reassuring. Do not use quotation marks.
    `,
});

const generatePepTalkFlow = ai.defineFlow(
    {
        name: 'generatePepTalkFlow',
        inputSchema: GeneratePepTalkInputSchema,
        outputSchema: GeneratePepTalkOutputSchema,
    },
    async (input) => {
        const { output } = await pepTalkPrompt(input);
        return output!;
    }
);


export async function generatePepTalk(input: GeneratePepTalkInput): Promise<GeneratePepTalkOutput> {
    return generatePepTalkFlow(input);
}
