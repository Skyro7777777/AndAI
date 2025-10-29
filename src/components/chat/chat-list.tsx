import { type Message } from '@/lib/types';
import { ChatMessage } from './chat-message';
import { Separator } from '../ui/separator';

interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
}

export function ChatList({ messages, isLoading, showAnswer, setShowAnswer }: ChatListProps) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-4">
      {messages.map((message, index) => (
        <div key={message.id}>
          <ChatMessage message={message} showAnswer={showAnswer} setShowAnswer={setShowAnswer} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
      {isLoading && (
        <>
            <Separator className="my-4 md:my-8" />
            <ChatMessage message={{ id: 'loading', role: 'assistant', content: '' }} isLoading />
        </>
      )}
    </div>
  );
}
