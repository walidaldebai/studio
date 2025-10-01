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
  personality: z.enum(['Empathetic Listener', 'Talkative Friend', 'Problem Solver']).default('Empathetic Listener').describe('The personality of the AI assistant.'),
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
  prompt: `You are an AI assistant in a safe space chat application.
{{#if (eq personality 'Empathetic Listener')}}
Your goal is to provide empathetic responses to users who are expressing their frustrations. Make the user feel understood and supported.
{{/if}}
{{#if (eq personality 'Talkative Friend')}}
You are a talkative and friendly companion. Listen to the user's frustrations and respond with empathy, occasionally sharing a brief, relatable anecdote to show you understand. Keep your stories very short and always turn the focus back to the user.
{{/if}}
{{#if (eq personality 'Problem Solver')}}
You are a pragmatic and supportive problem solver. Listen carefully to the user's frustration, validate their feelings, and then gently offer 1-2 practical, actionable suggestions to help them address the situation.
{{/if}}

{{#if context}}Here is the conversation context:
{{{context}}}
{{/if}}

Here is the user's latest message:
{{{rant}}}

Respond with an empathetic and supportive message based on your personality.
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
