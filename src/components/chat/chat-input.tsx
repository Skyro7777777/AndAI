'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendMessage } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { type Message } from '@/lib/types';
import { ArrowUp, HelpCircle, Bot, FileText, BrainCircuit, Cloud, Newspaper } from 'lucide-react';

interface ChatInputProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  story: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showEmptyScreenPrompts?: boolean;
  setShowAnswer: (show: boolean) => void;
}

const examplePrompts = [
    {
      icon: <HelpCircle size={16} />,
      text: 'What is AndAI Assistant?',
    },
    {
      icon: <Bot size={16} />,
      text: 'Tell me a funny joke',
    },
     {
      icon: <BrainCircuit size={16} />,
      text: 'Give me a trivia question',
    },
    {
      icon: <FileText size={16} />,
      text: 'Give me a random math fact',
    },
    {
      icon: <Cloud size={16} />,
      text: 'What\'s the weather in London?',
    },
    {
      icon: <Newspaper size={16} />,
      text: 'Show me the latest tech news',
    },
];

export function ChatInput({
  messages,
  setMessages,
  story,
  isLoading,
  setIsLoading,
  showEmptyScreenPrompts = false,
  setShowAnswer
}: ChatInputProps) {
  const [input, setInput] = React.useState('');
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>, prompt?: string) => {
    e.preventDefault();
    const value = prompt || input;
    if (!value || isLoading) return;

    setShowAnswer(false);
    setIsLoading(true);
    setInput('');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: value,
    };
    setMessages((prev) => [...prev, userMessage]);

    const res = await sendMessage(value, messages, story);

    if (res.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: res.error,
      });
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
    } else if (res.assistantResponse) {
      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: res.assistantResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto max-w-2xl px-4">
        {showEmptyScreenPrompts && (
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {examplePrompts.map((prompt, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start h-auto py-2.5 px-3.5 text-left"
                        onClick={(e) => handleSubmit(e, prompt.text)}
                        disabled={isLoading}
                    >
                    <div className="flex items-center gap-3">
                        {prompt.icon}
                        <span>{prompt.text}</span>
                    </div>
                    </Button>
                ))}
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
                ref={inputRef}
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input} aria-label="Send message">
                <ArrowUp size={16} />
            </Button>
        </form>
    </div>
  );
}
