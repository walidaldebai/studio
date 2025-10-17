'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating admin dashboard suggestions.
 * It analyzes user feedback and app usage data to propose actionable improvements.
 *
 * @exports {
 *   generateAdminDashboardSuggestions: (input: AdminDashboardSuggestionsInput) => Promise<AdminDashboardSuggestionsOutput>;
 *   AdminDashboardSuggestionsInput: type;
 *   AdminDashboardSuggestionsOutput: type;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Input schema for the flow
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

// Output schema for the flow
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

// The Genkit flow definition
const adminDashboardSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateAdminDashboardSuggestions',
    inputSchema: AdminDashboardSuggestionsInputSchema,
    outputSchema: AdminDashboardSuggestionsOutputSchema,
  },
  async input => {
    const prompt = `You are an AI assistant designed to analyze user feedback and app usage data to generate actionable suggestions for improving the Zen Zone application.

    Based on the following user feedback and app usage data, provide a list of suggestions for improving the application. Only generate suggestions that are supported by the data provided.

    User Feedback: ${input.userFeedback}
    Usage Data: ${input.usageData}`;

    const llmResponse = await ai.generate({
      prompt,
      model: 'googleai/gemini-pro',
      output: {
        schema: AdminDashboardSuggestionsOutputSchema,
      },
    });

    return llmResponse.output!;
  }
);

/**
 * Wrapper function to execute the flow.
 *
 * @param input - The input data containing user feedback and usage data.
 * @returns A promise that resolves to an object with actionable suggestions.
 */
export async function generateAdminDashboardSuggestions(
  input: AdminDashboardSuggestionsInput
): Promise<AdminDashboardSuggestionsOutput> {
  return adminDashboardSuggestionsFlow(input);
}
