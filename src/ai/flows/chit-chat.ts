'use server';
/**
 * @fileOverview A general purpose chit-chat and knowledge AI agent.
 *
 * - chitChat - A function that handles the conversation.
 * - ChitChatInput - The input type for the chitChat function.
 * - ChitChatOutput - The return type for the chitChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Message } from '@/lib/types';

const ChitChatInputSchema = z.object({
  query: z.string().describe('The user\'s message.'),
  history: z.array(z.custom<Message>()).describe('The conversation history.'),
});
export type ChitChatInput = z.infer<typeof ChitChatInputSchema>;

const ChitChatOutputSchema = z.object({
  answer: z.string().describe('The AI\'s response.'),
});
export type ChitChatOutput = z.infer<typeof ChitChatOutputSchema>;

export async function chitChat(input: ChitChatInput): Promise<ChitChatOutput> {
  return chitChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chitChatPrompt',
  input: { schema: ChitChatInputSchema },
  output: { schema: ChitChatOutputSchema },
  prompt: `You are AndAI, a helpful and friendly AI assistant. Your goal is to provide accurate and helpful answers to user questions.

  Conversation History:
  {{#each history}}
  {{#if (eq role 'user')}}User: {{content}}{{/if}}
  {{#if (eq role 'assistant')}}AI: {{content}}{{/if}}
  {{/each}}
  
  User's new message: {{{query}}}
  
  AI's response:`,
});

const chitChatFlow = ai.defineFlow(
  {
    name: 'chitChatFlow',
    inputSchema: ChitChatInputSchema,
    outputSchema: ChitChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
