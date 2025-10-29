'use client';

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { UserStoryInput } from './user-story-input';
import { ChatList } from './chat-list';
import { ChatInput } from './chat-input';
import { type Message } from '@/lib/types';
import { EmptyScreen } from './empty-screen';
import { Bot } from 'lucide-react';

interface ChatLayoutProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  story: string;
  setStory: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChatLayout({
  messages,
  setMessages,
  story,
  setStory,
  isLoading,
  setIsLoading,
}: ChatLayoutProps) {
  const [showAnswer, setShowAnswer] = React.useState(false);
  
  return (
    <SidebarProvider>
      <div className="flex h-full w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                <Bot size={20} />
              </div>
              <h2 className="text-lg font-semibold font-headline">AndAI Story</h2>
            </div>
          </SidebarHeader>
          <Separator />
          <SidebarContent>
            <UserStoryInput story={story} setStory={setStory} />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="max-h-screen">
          <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b bg-background z-10">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-2">
                   <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                      <Bot size={24} />
                   </div>
                   <h1 className="text-xl font-bold font-headline">AndAI Assistant</h1>
                </div>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto">
              {messages.length > 0 ? (
                <ChatList messages={messages} isLoading={isLoading} setShowAnswer={setShowAnswer} showAnswer={showAnswer} />
              ) : (
                <EmptyScreen />
              )}
            </div>
            <div className="p-4 border-t bg-background">
              <ChatInput
                messages={messages}
                setMessages={setMessages}
                story={story}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                showEmptyScreenPrompts={messages.length === 0}
                setShowAnswer={setShowAnswer}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
