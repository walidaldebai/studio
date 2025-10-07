'use server';

/**
 * @fileOverview A Genkit flow for generating creative, low-prep lesson ideas for teachers.
 *
 * This flow takes a lesson topic and generates an engaging activity to help reduce planning stress.
 *
 * @exports {
 *   generateLessonIdea: (input: LessonIdeaInput) => Promise<LessonIdeaOutput>;
 *   LessonIdeaInput: type
 *   LessonIdeaOutput: type
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const LessonIdeaInputSchema = z.object({
  topic: z.string().describe('The academic topic for the lesson plan.'),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the lesson idea.'),
});

export type LessonIdeaInput = z.infer<typeof LessonIdeaInputSchema>;

const LessonIdeaOutputSchema = z.object({
  title: z.string().describe("A catchy title for the lesson activity."),
  activity: z.string().describe("A step-by-step description of the creative, low-prep activity."),
  objective: z.string().describe("The learning objective for the activity."),
  materials: z.string().describe("A brief list of simple materials needed (e.g., 'Paper, markers, and imagination')."),
});

export type LessonIdeaOutput = z.infer<typeof LessonIdeaOutputSchema>;

const lessonIdeaPrompt = ai.definePrompt({
    name: 'lessonIdeaPrompt',
    input: {
        schema: LessonIdeaInputSchema,
    },
    output: {
        schema: LessonIdeaOutputSchema,
    },
    prompt: `You are an expert educational content creator, specializing in fun, low-preparation, and highly engaging classroom activities. A teacher needs help coming up with an idea for a lesson.
    
    The topic is: {{{topic}}}.
    The response should be in this language: {{{language}}}.

    Generate a creative lesson idea that requires minimal prep time. Provide a catchy title, a clear learning objective, a simple list of materials, and a step-by-step description of the activity.
    The tone should be inspiring, creative, and supportive.
    `,
});

const generateLessonIdeaFlow = ai.defineFlow(
    {
        name: 'generateLessonIdeaFlow',
        inputSchema: LessonIdeaInputSchema,
        outputSchema: LessonIdeaOutputSchema,
    },
    async (input) => {
        const { output } = await lessonIdeaPrompt(input);
        return output!;
    }
);


export async function generateLessonIdea(input: LessonIdeaInput): Promise<LessonIdeaOutput> {
    return generateLessonIdeaFlow(input);
}
