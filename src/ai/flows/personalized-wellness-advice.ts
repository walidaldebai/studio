'use server';

/**
 * @fileOverview A personalized wellness advice AI agent.
 *
 * - getPersonalizedWellnessAdvice - A function that generates tailored health and wellness advice based on user profile information.
 * - PersonalizedWellnessAdviceInput - The input type for the getPersonalizedWellnessAdvice function.
 * - PersonalizedWellnessAdviceOutput - The return type for the getPersonalizedWellnessAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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

const personalizedWellnessAdviceFlow = ai.defineFlow(
  {
    name: 'getPersonalizedWellnessAdvice',
    inputSchema: PersonalizedWellnessAdviceInputSchema,
    outputSchema: PersonalizedWellnessAdviceOutputSchema,
  },
  async input => {
    if (input.needs.length < 15) {
        return {
            advice: 'Your request is a bit brief. Could you please provide more details about your situation? The more information you give, the better I can tailor my advice to your specific needs.'
        };
    }

    let prompt = `You are an AI wellness assistant. Your goal is to provide relevant and helpful advice based on the user's profile.

    User Profile:
    Name: ${input.name}
    Gender: ${input.gender}
    Specialization: ${input.specialization}
    User Needs: ${input.needs}
    `;

    if (input.healthIssues) {
      prompt += `\nHealth Issues: ${input.healthIssues}`;
    }

    if (input.specialization.toLowerCase() === 'teacher') {
        prompt += '\nThe user is a teacher. Provide advice that is specifically tailored to the challenges and stressors of the teaching profession. Frame your advice with empathy for the demands of education.';
    }

    const llmResponse = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-pro',
        output: {
            schema: PersonalizedWellnessAdviceOutputSchema,
        },
    });
    
    return llmResponse.output!;
  }
);

export async function getPersonalizedWellnessAdvice(input: PersonalizedWellnessAdviceInput): Promise<PersonalizedWellnessAdviceOutput> {
  return personalizedWellnessAdviceFlow(input);
}
