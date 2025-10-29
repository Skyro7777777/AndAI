import { config } from 'dotenv';
config();

import '@/ai/flows/answer-questions-from-coqa.ts';
import '@/ai/flows/answer-questions-from-user-story.ts';
import '@/ai/flows/fallback-to-web-research.ts';
