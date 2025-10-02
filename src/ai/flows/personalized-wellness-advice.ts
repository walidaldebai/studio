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

  Based on the user's profile information, provide tailored advice that is relevant, appropriate, and helpful for their specific needs.

  User Profile:
  Name: {{{name}}}
  Gender: {{{gender}}}
  Specialization: {{{specialization}}}
  {{#if healthIssues}}
  Health Issues: {{{healthIssues}}}
  {{/if}}

  User Needs: {{{needs}}}

  Provide wellness advice:
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
