'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface UserStoryInputProps {
  story: string;
  setStory: (story: string) => void;
}

export function UserStoryInput({ story, setStory }: UserStoryInputProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="story-input">Your Custom Story</Label>
        <Textarea
          id="story-input"
          placeholder="Paste or write a story here. Ask questions about it in the chat."
          className="min-h-[200px] text-sm"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          aria-label="Custom story input"
        />
        <p className="text-xs text-muted-foreground">
            The assistant will use this story to answer your questions.
        </p>
      </div>
    </div>
  );
}
