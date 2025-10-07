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
  const output = await personalizedWellnessAdviceFlow(input);
  return output;
}

const prompt = ai.definePrompt({
  name: 'personalizedWellnessAdvicePrompt',
  input: {schema: PersonalizedWellnessAdviceInputSchema},
  output: {schema: PersonalizedWellnessAdviceOutputSchema},
  prompt: `You are an AI wellness assistant. Your goal is to provide relevant and helpful advice based on the user's profile.

  {{#if (eq specialization 'teacher')}}
  The user is a teacher. Provide advice that is specifically tailored to the challenges and stressors of the teaching profession. Frame your advice with empathy for the demands of education.
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
    if (input.needs.length < 15) {
        return {
            advice: 'Your request is a bit brief. Could you please provide more details about your situation? The more information you give, the better I can tailor my advice to your specific needs.'
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
