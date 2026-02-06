export declare const addDocumentToVectorDB: (content: string[], metadata: Record<string, string>) => Promise<string[]>;
export interface SearchResult {
    id: string;
    text: string;
    score: number;
    metadata: Record<string, unknown>;
}
export declare const searchDocuments: (query: string, topK?: number) => Promise<SearchResult[]>;
export declare const deleteFromVectorDB: (ids: string[]) => Promise<void>;
