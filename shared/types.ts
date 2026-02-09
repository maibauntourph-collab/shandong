// Inquiry types
export interface EventLogistics {
    staffAssigned: string[];
    vehicle: string;
    equipment: string[];
}

export interface Inquiry {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    eventDate: string;
    guestCount: number;
    eventType: string;
    budget?: string; // Made optional as it's not in the original interface but used
    message: string;
    status: 'pending' | 'contacted' | 'confirmed' | 'completed';
    notes?: string;
    eventLogistics?: EventLogistics;
    createdAt: string | Date;
}

// Inventory types
export interface InventoryItem {
    _id?: string; // Made optional to match frontend usage before save
    name: string;
    quantity: number;
    unit: string;
    threshold: number;
    category: string;
    lastUpdated: string | Date;
}

// Chat types
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string | Date;
}

export interface ChatSession {
    _id?: string;
    sessionId: string;
    messages: ChatMessage[];
    createdAt: string | Date;
}

// Document types
export interface UploadedDocument {
    _id?: string;
    filename: string;
    originalName: string;
    vectorIds: string[];
    uploadedAt: string | Date;
    chunkCount: number;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Chat API types
export interface ChatRequest {
    message: string;
    sessionId: string;
}

export interface ChatResponse {
    reply: string;
    sessionId: string;
}
