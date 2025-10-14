
'use server';

/**
 * @fileOverview A Genkit flow for generating a short, supportive message for teachers.
 *
 * This flow provides a quick, encouraging tip based on a common teacher stressor.
 *
 * @exports {
 *   generatePocketCoachMessage: (input: PocketCoachInput) => Promise<PocketCoachOutput>;
 *   PocketCoachInput: type;
 *   PocketCoachOutput: type;
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PocketCoachInputSchema = z.object({
  stressor: z.string().describe('The specific stressor the teacher is facing.'),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the output.'),
});

export type PocketCoachInput = z.infer<typeof PocketCoachInputSchema>;

const PocketCoachOutputSchema = z.object({
  message: z.string().describe('A short, encouraging, and actionable piece of advice for the teacher.'),
});

export type PocketCoachOutput = z.infer<typeof PocketCoachOutputSchema>;

const pocketCoachPrompt = ai.definePrompt({
    name: 'pocketCoachPrompt_coachPage',
    input: {
        schema: PocketCoachInputSchema,
    },
    output: {
        schema: PocketCoachOutputSchema,
    },
    prompt: `You are a wise and empathetic mentor for teachers, like a friendly coach in their pocket.
    A teacher is feeling stressed about: "{{stressor}}".

    Provide one short, encouraging, and actionable piece of advice in the following language: {{{language}}}.
    The message should be a single, impactful sentence.
    Your tone should be supportive and understanding. Do not use quotation marks.
    `,
});

const generatePocketCoachMessageFlow = ai.defineFlow(
    {
        name: 'generatePocketCoachMessageFlow_coachPage',
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
