'use client';

import { useState, useEffect } from 'react';
import { ChatLayout } from '@/components/chat/chat-layout';
import { type Message } from '@/lib/types';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [story, setStory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // This is a common pattern to avoid hydration errors with client-side state.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <main className="flex h-[calc(100dvh)] w-full flex-col items-center justify-center">
      <ChatLayout
        messages={messages}
        setMessages={setMessages}
        story={story}
        setStory={setStory}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </main>
  );
}
