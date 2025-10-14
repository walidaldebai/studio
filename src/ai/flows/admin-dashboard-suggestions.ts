
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating admin dashboard suggestions based on user feedback and app usage data.
 *
 * The flow analyzes provided data to suggest actionable improvements for the Zen Zone app.
 *
 * @exports {
 *   generateAdminDashboardSuggestions: (input: AdminDashboardSuggestionsInput) => Promise<AdminDashboardSuggestionsOutput>;
 *   AdminDashboardSuggestionsInput: type
 *   AdminDashboardSuggestionsOutput: type
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const AdminDashboardSuggestionsInputSchema = z.object({
  userFeedback: z
    .string()
    .describe('A summary of user feedback regarding the application.'),
  usageData: z
    .string()
    .describe('A summary of application usage data, including feature usage.'),
});

export type AdminDashboardSuggestionsInput = z.infer<
  typeof AdminDashboardSuggestionsInputSchema
>;

// Define the output schema for the flow
const AdminDashboardSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of actionable suggestions for improving the application, based on the provided user feedback and usage data.'
    ),
});

export type AdminDashboardSuggestionsOutput = z.infer<
  typeof AdminDashboardSuggestionsOutputSchema
>;

// Define the prompt
const adminDashboardSuggestionsPrompt = ai.definePrompt({
  name: 'adminDashboardSuggestionsPrompt',
  input: {
    schema: AdminDashboardSuggestionsInputSchema,
  },
  output: {
    schema: AdminDashboardSuggestionsOutputSchema,
  },
  prompt: `You are an AI assistant designed to analyze user feedback and app usage data to generate actionable suggestions for improving the Zen Zone application.

  Based on the following user feedback and app usage data, provide a list of suggestions for improving the application. Only generate suggestions that are supported by the data provided.

  User Feedback: {{{userFeedback}}}
  Usage Data: {{{usageData}}}
  `,
});


// Define the flow itself
const adminDashboardSuggestionsFlow = ai.defineFlow(
  {
    name: 'adminDashboardSuggestionsFlow',
    inputSchema: AdminDashboardSuggestionsInputSchema,
    outputSchema: AdminDashboardSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await adminDashboardSuggestionsPrompt(input);
    return output!;
  }
);


/**
 * Generates admin dashboard suggestions based on user feedback and app usage data.
 *
 * @param input - The input data containing user feedback and app usage data.
 * @returns A promise that resolves to an object containing a list of actionable suggestions.
 */
export async function generateAdminDashboardSuggestions(
  input: AdminDashboardSuggestionsInput
): Promise<AdminDashboardSuggestionsOutput> {
  return adminDashboardSuggestionsFlow(input);
}
