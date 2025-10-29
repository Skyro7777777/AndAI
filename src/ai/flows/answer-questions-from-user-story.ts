'use server';
/**
 * @fileOverview A question answering AI agent that answers questions based on a user-provided story.
 *
 * - answerQuestionsFromUserStory - A function that answers questions about a user-provided story.
 * - AnswerQuestionsFromUserStoryInput - The input type for the answerQuestionsFromUserStory function.
 * - AnswerQuestionsFromUserStoryOutput - The return type for the answerQuestionsFromUserStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsFromUserStoryInputSchema = z.object({
  story: z.string().describe('The user-provided story content.'),
  question: z.string().describe('The question about the story.'),
});
export type AnswerQuestionsFromUserStoryInput = z.infer<
  typeof AnswerQuestionsFromUserStoryInputSchema
>;

const AnswerQuestionsFromUserStoryOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the story.'),
});
export type AnswerQuestionsFromUserStoryOutput = z.infer<
  typeof AnswerQuestionsFromUserStoryOutputSchema
>;

export async function answerQuestionsFromUserStory(
  input: AnswerQuestionsFromUserStoryInput
): Promise<AnswerQuestionsFromUserStoryOutput> {
  return answerQuestionsFromUserStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsFromUserStoryPrompt',
  input: {schema: AnswerQuestionsFromUserStoryInputSchema},
  output: {schema: AnswerQuestionsFromUserStoryOutputSchema},
  prompt: `You are an AI assistant that answers questions based on the provided story content.

  Story: {{{story}}}

  Question: {{{question}}}

  Answer: `,
});

const answerQuestionsFromUserStoryFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFromUserStoryFlow',
    inputSchema: AnswerQuestionsFromUserStoryInputSchema,
    outputSchema: AnswerQuestionsFromUserStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
