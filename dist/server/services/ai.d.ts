interface ChatHistory {
    role: 'user' | 'assistant';
    content: string;
}
export declare const chatWithAI: (message: string, context: string[], history: ChatHistory[]) => Promise<string>;
export {};
