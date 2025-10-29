'use server';

/**
 * @fileOverview Implements a Genkit flow that uses web research as a fallback when the chatbot doesn't have a direct answer.
 *
 * - fallbackToWebResearch - A function that uses DuckDuckGo Instant Answers for information retrieval when a suitable offline answer isn't available.
 * - FallbackToWebResearchInput - The input type for the fallbackToWebResearch function.
 * - FallbackToWebResearchOutput - The return type for the fallbackToWebResearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const FallbackToWebResearchInputSchema = z.object({
  query: z.string().describe('The search query to use for web research.'),
});
export type FallbackToWebResearchInput = z.infer<typeof FallbackToWebResearchInputSchema>;

const FallbackToWebResearchOutputSchema = z.object({
  answer: z.string().describe('The answer retrieved from web research.'),
});
export type FallbackToWebResearchOutput = z.infer<typeof FallbackToWebResearchOutputSchema>;

export async function fallbackToWebResearch(input: FallbackToWebResearchInput): Promise<FallbackToWebResearchOutput> {
  return fallbackToWebResearchFlow(input);
}

const fallbackToWebResearchPrompt = ai.definePrompt({
  name: 'fallbackToWebResearchPrompt',
  input: {schema: FallbackToWebResearchInputSchema},
  output: {schema: FallbackToWebResearchOutputSchema},
  prompt: `Use DuckDuckGo Instant Answers to find the answer to the following question: {{{query}}}.\n\nAnswer: `,
});

const fallbackToWebResearchFlow = ai.defineFlow(
  {
    name: 'fallbackToWebResearchFlow',
    inputSchema: FallbackToWebResearchInputSchema,
    outputSchema: FallbackToWebResearchOutputSchema,
  },
  async input => {
    const {output} = await fallbackToWebResearchPrompt(input);
    return output!;
  }
);
