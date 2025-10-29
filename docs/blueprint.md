# **App Name**: AndAI Assistant

## Core Features:

- Basic Chat Interface: UI to send/receive messages, powered by RecyclerView.
- User Story Input: Allows the user to input a custom story via EditText.
- Chit-Chat Engine: Responds to common greetings and questions via pattern matching.
- CoQA Dataset Q&A: Answers questions based on a knowledge base loaded from the CoQA dataset.
- Story-Based Q&A: Answers questions based on user-provided story content, attempting to extract context via keyword analysis. The chatbot will use a tool to locate specific details or themes.
- Web Research Fallback: When no suitable offline answer is available, utilizes DuckDuckGo Instant Answers for information retrieval, plus other free-tier services.
- API Service Integration: Fetch data using open APIs (weather, jokes, math facts, news, trivia, finance, etc.)
- Multiple API fallback: If one web service does not know the answer, use other web services instead, in a priority based order

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke trust and intelligence.
- Background color: Very light gray (#F5F5F5) to maintain a clean, readable interface.
- Accent color: Teal (#009688) to highlight important interactive elements.
- Body and headline font: 'PT Sans' (sans-serif) for clear readability on various screen sizes.
- Code font: 'Source Code Pro' (monospace) if code snippets are ever displayed.
- Simple, clear icons for different message types and actions.
- Clean and efficient layout with the chat log taking the majority of screen real estate.