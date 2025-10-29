'use server';
/**
 * @fileOverview A question answering AI agent based on the CoQA dataset.
 *
 * - answerQuestionsFromCoQA - A function that handles the question answering process.
 * - AnswerQuestionsFromCoQAInput - The input type for the answerQuestionsFromCoQA function.
 * - AnswerQuestionsFromCoQAOutput - The return type for the answerQuestionsFromCoQA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsFromCoQAInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
  context: z.string().describe('The context from the CoQA dataset.'),
});
export type AnswerQuestionsFromCoQAInput = z.infer<typeof AnswerQuestionsFromCoQAInputSchema>;

const AnswerQuestionsFromCoQAOutputSchema = z.object({
  answer: z.string().describe('The answer to the question based on the context.'),
});
export type AnswerQuestionsFromCoQAOutput = z.infer<typeof AnswerQuestionsFromCoQAOutputSchema>;

export async function answerQuestionsFromCoQA(input: AnswerQuestionsFromCoQAInput): Promise<AnswerQuestionsFromCoQAOutput> {
  return answerQuestionsFromCoQAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsFromCoQAPrompt',
  input: {schema: AnswerQuestionsFromCoQAInputSchema},
  output: {schema: AnswerQuestionsFromCoQAOutputSchema},
  prompt: `You are an expert question answering system. Use the context provided to answer the question.

Context: {{{context}}}

Question: {{{question}}}

Answer: `,
});

const answerQuestionsFromCoQAFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFromCoQAFlow',
    inputSchema: AnswerQuestionsFromCoQAInputSchema,
    outputSchema: AnswerQuestionsFromCoQAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
