'use server';

/**
 * @fileOverview A personalized wellness advice AI agent.
 *
 * - getPersonalizedWellnessAdvice - A function that generates tailored health and wellness advice based on user profile information.
 * - PersonalizedWellnessAdviceInput - The input type for the getPersonalizedWellnessAdvice function.
 * - PersonalizedWellnessAdviceOutput - The return type for the getPersonalizedWellnessAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedWellnessAdviceInputSchema = z.object({
  name: z.string().describe("The user's name."),
  gender: z.string().describe("The user's gender."),
  specialization: z.string().describe("The user's specialization or profession."),
  healthIssues: z.string().optional().describe("The user's health issues or concerns."),
  needs: z.string().describe("The user's specific needs or questions regarding wellness."),
});
export type PersonalizedWellnessAdviceInput = z.infer<typeof PersonalizedWellnessAdviceInputSchema>;

const PersonalizedWellnessAdviceOutputSchema = z.object({
  advice: z.string().describe('Tailored health and wellness advice based on the user profile.'),
});
export type PersonalizedWellnessAdviceOutput = z.infer<typeof PersonalizedWellnessAdviceOutputSchema>;

export async function getPersonalizedWellnessAdvice(input: PersonalizedWellnessAdviceInput): Promise<PersonalizedWellnessAdviceOutput> {
  return personalizedWellnessAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedWellnessAdvicePrompt',
  input: {schema: PersonalizedWellnessAdviceInputSchema},
  output: {schema: PersonalizedWellnessAdviceOutputSchema},
  prompt: `You are an AI wellness assistant that provides personalized health and wellness advice.

  Your goal is to provide relevant, appropriate, and helpful advice based on the user's profile.

  If the user's request in the "User Needs" section is very short or vague (e.g., less than 15 characters), kindly ask them to provide more details about their situation so you can offer more specific and helpful advice. Do not try to guess or give advice on a vague request.

  If the user's request is detailed enough, provide thoughtful wellness advice.

  {{#if specialization}}
  The user is a {{specialization}}. If their specialization is 'teacher', provide advice that is specifically tailored to the challenges and stressors of the teaching profession. Frame the advice in a way that is practical for a teacher to implement during their workday or after school.
  {{/if}}

  User Profile:
  Name: {{{name}}}
  Gender: {{{gender}}}
  Specialization: {{{specialization}}}
  {{#if healthIssues}}
  Health Issues: {{{healthIssues}}}
  {{/if}}

  User Needs: {{{needs}}}
  `,
});

const personalizedWellnessAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedWellnessAdviceFlow',
    inputSchema: PersonalizedWellnessAdviceInputSchema,
    outputSchema: PersonalizedWellnessAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
