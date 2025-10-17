'use server';

/**
 * @fileOverview An AI-powered chat for users to express frustrations and receive empathetic responses.
 *
 * - rantChatEmpathy - A function that handles the rant chat process.
 * - RantChatEmpathyInput - The input type for the rantChatEmpathy function.
 * - RantChatEmpathyOutput - The return type for the rantChatEmpathy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RantChatEmpathyInputSchema = z.object({
  rant: z.string().describe("The user's rant or expression of frustration."),
  context: z.string().optional().describe('The context of the conversation so far.'),
});
export type RantChatEmpathyInput = z.infer<typeof RantChatEmpathyInputSchema>;

const RantChatEmpathyOutputSchema = z.object({
  response: z.string().describe("The AI's empathetic response to the user's rant."),
});
export type RantChatEmpathyOutput = z.infer<typeof RantChatEmpathyOutputSchema>;

const rantChatEmpathyFlow = ai.defineFlow(
  {
    name: 'rantChatEmpathy',
    inputSchema: RantChatEmpathyInputSchema,
    outputSchema: RantChatEmpathyOutputSchema,
  },
  async input => {
    let prompt = `You are a deeply empathetic and compassionate friend in a safe space chat application. Your only purpose is to listen and make the user feel heard, validated, and understood. Your tone should be warm, caring, and genuine. Use phrases that convey deep empathy, like "That sounds incredibly difficult," "It makes complete sense that you would feel that way," or "Thank you for sharing that with me." Your goal is to be a comforting presence. Do not offer solutions or advice, simply reflect their feelings and validate their experience.`;

    if (input.context) {
        prompt += `\n\nThis is the conversation history so far:\n${input.context}`;
    }

    prompt += `\n\nHere is the user's latest message:\n${input.rant}\n\nRespond with an empathetic and supportive message.`;
    
    const llmResponse = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-pro',
        output: {
            schema: RantChatEmpathyOutputSchema,
        },
    });

    return llmResponse.output!;
  }
);

export async function rantChatEmpathy(input: RantChatEmpathyInput): Promise<RantChatEmpathyOutput> {
  return rantChatEmpathyFlow(input);
}
