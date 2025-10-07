'use server';

/**
 * @fileOverview A Genkit flow for generating a supportive message from a "Pocket Coach" for teachers.
 *
 * This flow takes a specific stressor and generates a short, actionable, and empathetic tip.
 *
 * @exports {
 *   generatePocketCoachMessage: (input: PocketCoachInput) => Promise<PocketCoachOutput>;
 *   PocketCoachInput: type
 *   PocketCoachOutput: type
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PocketCoachInputSchema = z.object({
  stressor: z.string().describe('The specific stressor the teacher is facing.'),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the message.'),
});

export type PocketCoachInput = z.infer<typeof PocketCoachInputSchema>;

const PocketCoachOutputSchema = z.object({
  message: z.string().describe('A short, actionable, and empathetic tip for the teacher.'),
});

export type PocketCoachOutput = z.infer<typeof PocketCoachOutputSchema>;

const pocketCoachPrompt = ai.definePrompt({
    name: 'pocketCoachPrompt',
    input: {
        schema: PocketCoachInputSchema,
    },
    output: {
        schema: PocketCoachOutputSchema,
    },
    prompt: `You are a "Pocket Coach" for teachers, providing brief, compassionate, and actionable advice. Your tone is supportive and understanding.
    The teacher is dealing with the following stressor: {{{stressor}}}.
    The response should be in this language: {{{language}}}.

    Generate a single, encouraging message (2-3 sentences) that offers a simple, concrete strategy or a shift in perspective.
    Do not use markdown or quotation marks.
    `,
});

const generatePocketCoachMessageFlow = ai.defineFlow(
    {
        name: 'generatePocketCoachMessageFlow',
        inputSchema: PocketCoachInputSchema,
        outputSchema: PocketCoachOutputSchema,
    },
    async (input) => {
        const { output } = await pocketCoachPrompt(input);
        return output!;
    }
);


export async function generatePocketCoachMessage(input: PocketCoachInput): Promise<PocketCoachOutput> {
    return generatePocketCoachMessageFlow(input);
}
