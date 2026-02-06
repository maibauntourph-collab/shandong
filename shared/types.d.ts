export interface Inquiry {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    eventDate: string;
    guestCount: number;
    eventType: string;
    message: string;
    status: 'pending' | 'contacted' | 'confirmed' | 'completed';
    createdAt: Date;
}
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
export interface ChatSession {
    _id?: string;
    sessionId: string;
    messages: ChatMessage[];
    createdAt: Date;
}
export interface UploadedDocument {
    _id?: string;
    filename: string;
    originalName: string;
    vectorIds: string[];
    uploadedAt: Date;
    chunkCount: number;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
export interface ChatRequest {
    message: string;
    sessionId: string;
}
export interface ChatResponse {
    reply: string;
    sessionId: string;
}
