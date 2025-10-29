import { type Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { memo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: Partial<Message>;
  isLoading?: boolean;
  showAnswer?: boolean;
  setShowAnswer?: (show: boolean) => void;
}

export const ChatMessage = memo(({ message, isLoading, showAnswer, setShowAnswer }: ChatMessageProps) => {
  const { role, content } = message;

  const isTrivia = content?.includes('Trivia Time!');
  const correctAnswerSeparator = "|||---CORRECT_ANSWER---|||";
  const [questionPart, answerPart] = isTrivia ? content.split(correctAnswerSeparator) : [content, ''];

  return (
    <div className="p-4">
      <div
        className={cn('flex items-start gap-4', {
          'flex-row-reverse': role === 'user',
        })}
      >
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            role === 'assistant'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground'
          )}
        >
          {role === 'assistant' ? <Bot size={24} /> : <User size={24} />}
        </div>
        <div
          className={cn(
            'flex-1 space-y-2 overflow-hidden px-1',
            role === 'user' ? 'text-right' : 'text-left'
          )}
        >
          <div className="text-base text-foreground leading-relaxed">
            {isLoading ? (
              <div className={cn("space-y-2", role === 'user' ? 'items-end flex flex-col' : 'items-start')}>
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
                <div className="whitespace-pre-wrap">
                  {questionPart}
                  {isTrivia && (
                    <div className="mt-4">
                      {showAnswer ? (
                        <p className="font-bold p-2 bg-secondary rounded-md">Correct Answer: {answerPart}</p>
                      ) : (
                        <Button onClick={() => setShowAnswer?.(true)}>Show Answer</Button>
                      )}
                    </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
