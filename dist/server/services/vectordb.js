import { ChromaClient } from 'chromadb';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const CHROMA_HOST = process.env.CHROMA_HOST || 'localhost';
const CHROMA_PORT = process.env.CHROMA_PORT || '8000';
let collection = null;
let chromaClient = null;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// Initialize Chroma connection
const initChroma = async () => {
    if (collection)
        return collection;
    try {
        chromaClient = new ChromaClient({
            path: `http://${CHROMA_HOST}:${CHROMA_PORT}`,
        });
        // Get or create collection
        collection = await chromaClient.getOrCreateCollection({
            name: 'catering_docs',
            metadata: { description: 'Catering service documents for RAG' },
        });
        console.log('🔗 Connected to Chroma vector database');
        return collection;
    }
    catch (error) {
        console.error('Chroma connection error:', error);
        console.log('📝 Running without vector database - fallback mode');
        return null;
    }
};
// Generate embedding using Gemini
const generateEmbedding = async (text) => {
    if (!genAI) {
        // Return dummy embedding if no API key
        return Array(768).fill(0).map(() => Math.random());
    }
    try {
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(text);
        return result.embedding.values;
    }
    catch (error) {
        console.error('Embedding generation error:', error);
        throw error;
    }
};
// Split text into chunks
const chunkText = (text, chunkSize = 500, overlap = 50) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end).trim());
        start = end - overlap;
    }
    return chunks.filter(chunk => chunk.length > 10);
};
// Add document to vector database
export const addDocumentToVectorDB = async (content, metadata) => {
    const col = await initChroma();
    if (!col) {
        console.log('Vector DB not available, skipping document indexing');
        return [];
    }
    const ids = [];
    const documents = [];
    const embeddings = [];
    const metadatas = [];
    for (const text of content) {
        const chunks = chunkText(text);
        for (const chunk of chunks) {
            if (chunk.length < 10)
                continue;
            const id = uuidv4();
            ids.push(id);
            documents.push(chunk);
            metadatas.push({ ...metadata, chunkIndex: String(chunks.indexOf(chunk)) });
            try {
                const embedding = await generateEmbedding(chunk);
                embeddings.push(embedding);
            }
            catch (error) {
                console.error('Error generating embedding:', error);
                // Use placeholder embedding
                embeddings.push(Array(768).fill(0));
            }
        }
    }
    if (ids.length === 0) {
        return [];
    }
    try {
        await col.add({
            ids,
            documents,
            embeddings,
            metadatas,
        });
        console.log(`✅ Added ${ids.length} chunks to vector database`);
        return ids;
    }
    catch (error) {
        console.error('Error adding to vector DB:', error);
        throw error;
    }
};
export const searchDocuments = async (query, topK = 3) => {
    const col = await initChroma();
    if (!col) {
        return [];
    }
    try {
        const queryEmbedding = await generateEmbedding(query);
        const results = await col.query({
            queryEmbeddings: [queryEmbedding],
            nResults: topK,
        });
        if (!results.documents?.[0]) {
            return [];
        }
        return results.documents[0].map((doc, i) => ({
            id: results.ids[0][i] || '',
            text: doc || '',
            score: results.distances?.[0]?.[i] || 0,
            metadata: results.metadatas?.[0]?.[i] || {},
        }));
    }
    catch (error) {
        console.error('Vector search error:', error);
        return [];
    }
};
// Delete documents from vector database
export const deleteFromVectorDB = async (ids) => {
    const col = await initChroma();
    if (!col || ids.length === 0) {
        return;
    }
    try {
        await col.delete({ ids });
        console.log(`🗑️ Deleted ${ids.length} chunks from vector database`);
    }
    catch (error) {
        console.error('Error deleting from vector DB:', error);
    }
};
