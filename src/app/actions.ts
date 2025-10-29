'use server';

import { answerQuestionsFromCoQA } from '@/ai/flows/answer-questions-from-coqa';
import { answerQuestionsFromUserStory } from '@/ai/flows/answer-questions-from-user-story';
import { fallbackToWebResearch } from '@/ai/flows/fallback-to-web-research';
import { chitChat } from '@/ai/flows/chit-chat';
import type { Message } from '@/lib/types';

// The context for the CoQA-based Q&A about the assistant itself.
const ASSISTANT_CONTEXT =
  'AndAI is a state-of-the-art conversational AI assistant created by a team of dedicated engineers. It is designed to be helpful, friendly, and knowledgeable. AndAI leverages multiple AI models and external APIs to provide comprehensive answers. Its core features include answering questions from provided text, general chit-chat, and falling back to web search when needed.';

async function getJoke(): Promise<string> {
  try {
    const response = await fetch(
      'https://official-joke-api.appspot.com/random_joke',
      { cache: 'no-store' }
    );
    if (!response.ok) throw new Error('Failed to fetch joke');
    const data = await response.json();
    return `${data.setup}\n${data.punchline}`;
  } catch (error) {
    console.error('Joke API failed:', error);
    // Fallback
    return "I tried to tell a joke, but I think I forgot the punchline. My apologies!";
  }
}

async function getMathFact(): Promise<string> {
  try {
    const response = await fetch('http://numbersapi.com/random/math', {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch math fact');
    return await response.text();
  } catch (error) {
    console.error('Math Fact API failed:', error);
    return "I looked for a math fact, but it seems they don't add up right now.";
  }
}

async function getTrivia(): Promise<string> {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch trivia');
        const data = await response.json();
        const trivia = data.results[0];
        const options = [...trivia.incorrect_answers, trivia.correct_answer].sort(() => Math.random() - 0.5);
        // Using an obscure separator to reliably split the answer later
        const correctAnswerSeparator = "|||---CORRECT_ANSWER---|||";
        return `Trivia Time!\n\nCategory: ${decodeURIComponent(trivia.category)}\n\nQuestion: ${decodeURIComponent(trivia.question)}\n\nOptions:\n- ${options.map(decodeURIComponent).join('\n- ')}\n\n${correctAnswerSeparator}${decodeURIComponent(trivia.correct_answer)}`;
    } catch (error) {
        console.error('Trivia API failed:', error);
        return "I wanted to play trivia, but couldn't find a good question. Ask me something else!";
    }
}


export async function sendMessage(
  message: string,
  history: Message[],
  story: string
): Promise<{ assistantResponse?: string; error?: string }> {
  const lowerCaseMessage = message.toLowerCase();

  try {
    // 1. API Integrations for specific keywords
    if (lowerCaseMessage.includes('joke')) {
      const joke = await getJoke();
      return { assistantResponse: joke };
    }
    if (lowerCaseMessage.includes('math fact') || lowerCaseMessage.includes('number fact')) {
      const fact = await getMathFact();
      return { assistantResponse: fact };
    }
    if (lowerCaseMessage.includes('trivia')) {
      const trivia = await getTrivia();
      return { assistantResponse: trivia };
    }

    // 2. Story-Based Q&A
    if (story.trim().length > 0) {
      try {
        const result = await answerQuestionsFromUserStory({
          story,
          question: message,
        });
        // If the model is confident, it will answer. If not, it might say "I don't know".
        // We check for that to decide if we should proceed.
        if (result.answer && !/i (don't know|cannot answer)/i.test(result.answer)) {
          return { assistantResponse: result.answer };
        }
      } catch (e) {
        console.error('Story Q&A flow failed:', e);
        // Don't return, allow fallback to other methods.
      }
    }

    // 3. CoQA Dataset Q&A (about the assistant itself)
    // This is for questions like "What is AndAI?"
     try {
      const result = await answerQuestionsFromCoQA({
        context: ASSISTANT_CONTEXT,
        question: message,
      });
      if (result.answer && !/i (don't know|cannot answer)/i.test(result.answer)) {
        return { assistantResponse: result.answer };
      }
    } catch (e) {
      console.error('CoQA Q&A flow failed:', e);
    }
    
    // 4. General Chit-Chat and Knowledge using a powerful LLM
    try {
      const result = await chitChat({ query: message, history });
      if (result.answer) {
        return { assistantResponse: result.answer };
      }
    } catch (e) {
      console.error('Chit-chat flow failed:', e);
    }

    // 5. Web Research Fallback
    try {
      const result = await fallbackToWebResearch({ query: message });
      if (result.answer) {
        return { assistantResponse: result.answer };
      }
    } catch (e) {
      console.error('Web research flow failed:', e);
    }

    return {
      assistantResponse:
        "I'm sorry, I couldn't find an answer to that. Could you try rephrasing your question?",
    };
  } catch (error) {
    console.error('An unexpected error occurred in sendMessage:', error);
    return {
      error:
        'An unexpected error occurred. Please check the server console for more details.',
    };
  }
}
