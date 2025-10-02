'use server';

/**
 * @fileOverview An AI-powered chat for users to express frustrations and receive empathetic responses.
 *
 * - rantChatEmpathy - A function that handles the rant chat process.
 * - RantChatEmpathyInput - The input type for the rantChatEmpathy function.
 * - RantChatEmpathyOutput - The return type for the rantChatEmpathy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RantChatEmpathyInputSchema = z.object({
  rant: z.string().describe("The user's rant or expression of frustration."),
  context: z.string().optional().describe('The context of the conversation so far.'),
});

export type RantChatEmpathyInput = z.infer<typeof RantChatEmpathyInputSchema>;

const RantChatEmpathyOutputSchema = z.object({
  response: z.string().describe("The AI's empathetic response to the user's rant."),
});

export type RantChatEmpathyOutput = z.infer<typeof RantChatEmpathyOutputSchema>;

export async function rantChatEmpathy(input: RantChatEmpathyInput): Promise<RantChatEmpathyOutput> {
  return rantChatEmpathyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rantChatEmpathyPrompt',
  input: {schema: RantChatEmpathyInputSchema},
  output: {schema: RantChatEmpathyOutputSchema},
  prompt: `You are an AI assistant in a safe space chat application. Your goal is to provide empathetic responses to users who are expressing their frustrations. Make the user feel understood and supported. Do not offer solutions, just listen.

{{#if context}}
This is the conversation history so far:
{{{context}}}
{{/if}}

Here is the user's latest message:
{{{rant}}}

Respond with an empathetic and supportive message.
  `,
});

const rantChatEmpathyFlow = ai.defineFlow(
  {
    name: 'rantChatEmpathyFlow',
    inputSchema: RantChatEmpathyInputSchema,
    outputSchema: RantChatEmpathyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
