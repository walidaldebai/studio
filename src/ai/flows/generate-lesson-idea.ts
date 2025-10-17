'use server';

/**
 * @fileOverview A Genkit flow for generating creative lesson ideas for teachers.
 *
 * This flow takes a topic and generates a low-prep, engaging activity.
 *
 * @exports {
 *   generateLessonIdea: (input: LessonIdeaInput) => Promise<LessonIdeaOutput>;
 *   LessonIdeaInput: type;
 *   LessonIdeaOutput: type;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const LessonIdeaInputSchema = z.object({
  topic: z.string().describe('The subject or topic for the lesson.'),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the output.'),
});
export type LessonIdeaInput = z.infer<typeof LessonIdeaInputSchema>;

const LessonIdeaOutputSchema = z.object({
  title: z.string().describe('A creative title for the lesson activity.'),
  objective: z.string().describe('A concise learning objective for the activity.'),
  materials: z.string().describe('A short list of simple, common materials needed.'),
  activity: z.string().describe('A step-by-step description of the creative, low-prep classroom activity.'),
});
export type LessonIdeaOutput = z.infer<typeof LessonIdeaOutputSchema>;

const generateLessonIdeaFlow = ai.defineFlow(
    {
        name: 'generateLessonIdea',
        inputSchema: LessonIdeaInputSchema,
        outputSchema: LessonIdeaOutputSchema,
    },
    async (input) => {
        const prompt = `You are a creative curriculum designer who specializes in making learning fun and accessible for overworked teachers.
        Your goal is to generate a single, creative, and very low-prep lesson activity idea based on a given topic. The language should be: ${input.language}.

        The topic is: ${input.topic}

        Generate the following:
        1.  A creative and catchy title for the activity.
        2.  A single, clear learning objective.
        3.  A list of simple materials (e.g., "Paper, markers, string").
        4.  A step-by-step guide for the activity. The activity must be engaging, simple to explain, and require minimal preparation from the teacher.
        `;

        const llmResponse = await ai.generate({
            prompt: prompt,
            model: 'googleai/gemini-pro',
            output: {
                schema: LessonIdeaOutputSchema,
            },
        });
        return llmResponse.output!;
    }
);

export async function generateLessonIdea(input: LessonIdeaInput): Promise<LessonIdeaOutput> {
    return generateLessonIdeaFlow(input);
}
