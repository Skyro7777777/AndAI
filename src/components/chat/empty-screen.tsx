import { Bot } from 'lucide-react';

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4 h-full flex flex-col justify-center items-center text-center">
      <div className="p-8">
        <div className="inline-block p-4 mb-4 bg-primary text-primary-foreground rounded-full shadow-lg">
            <Bot size={40} />
        </div>
        <h1 className="text-2xl font-semibold font-headline">AndAI Assistant</h1>
        <p className="mt-2 text-muted-foreground">
            Your friendly AI Chat Assistant. <br/> Start a conversation below.
        </p>
      </div>
    </div>
  );
}
