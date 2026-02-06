import { Router } from 'express';
import multer from 'multer';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';
import { parseDocument } from '../services/document.js';
import { addDocumentToVectorDB } from '../services/vectordb.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
const router = Router();
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        }
        catch (error) {
            cb(error, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('지원하지 않는 파일 형식입니다.'));
        }
    },
});
// Upload and process document
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: '파일이 필요합니다.' });
        }
        const { originalname, filename, path: filePath, mimetype, size } = req.file;
        // Parse document content
        const fileBuffer = await fs.readFile(filePath);
        const parsedContent = await parseDocument(fileBuffer, mimetype, originalname);
        if (!parsedContent || parsedContent.length === 0) {
            return res.status(400).json({
                success: false,
                error: '문서에서 내용을 추출할 수 없습니다.'
            });
        }
        // Add to vector database
        const vectorIds = await addDocumentToVectorDB(parsedContent, {
            filename: originalname,
            uploadedAt: new Date().toISOString(),
        });
        // Save document metadata to MongoDB
        const db = getDB();
        const document = {
            filename,
            originalName: originalname,
            mimetype,
            size,
            vectorIds,
            chunkCount: parsedContent.length,
            uploadedAt: new Date(),
        };
        const result = await db.collection('documents').insertOne(document);
        res.status(201).json({
            success: true,
            data: {
                id: result.insertedId,
                originalName: originalname,
                chunkCount: parsedContent.length,
            },
            message: '문서가 성공적으로 업로드되었습니다.',
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : '파일 업로드 실패'
        });
    }
});
// Get all documents
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const documents = await db.collection('documents')
            .find()
            .sort({ uploadedAt: -1 })
            .toArray();
        res.json({ success: true, data: documents });
    }
    catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ success: false, error: '문서 목록 조회 실패' });
    }
});
// Delete document
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const document = await db.collection('documents').findOne({
            _id: new ObjectId(id)
        });
        if (!document) {
            return res.status(404).json({ success: false, error: '문서를 찾을 수 없습니다.' });
        }
        // Delete file
        const filePath = path.join(process.cwd(), 'uploads', document.filename);
        try {
            await fs.unlink(filePath);
        }
        catch (e) {
            console.log('File already deleted or not found');
        }
        // Delete from MongoDB
        await db.collection('documents').deleteOne({ _id: new ObjectId(id) });
        // TODO: Delete from vector database
        res.json({ success: true, message: '문서가 삭제되었습니다.' });
    }
    catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ success: false, error: '문서 삭제 실패' });
    }
});
export default router;
