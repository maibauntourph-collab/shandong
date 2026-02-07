"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const db_js_1 = require("../db.js");
const mongodb_1 = require("mongodb");
const document_js_1 = require("../services/document.js");
const vectordb_js_1 = require("../services/vectordb.js");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path_1.default.join(process.cwd(), 'uploads');
        try {
            await promises_1.default.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        }
        catch (error) {
            cb(error, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload = (0, multer_1.default)({
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
        const fileBuffer = await promises_1.default.readFile(filePath);
        const parsedContent = await (0, document_js_1.parseDocument)(fileBuffer, mimetype, originalname);
        if (!parsedContent || parsedContent.length === 0) {
            return res.status(400).json({
                success: false,
                error: '문서에서 내용을 추출할 수 없습니다.'
            });
        }
        // Add to vector database
        const vectorIds = await (0, vectordb_js_1.addDocumentToVectorDB)(parsedContent, {
            filename: originalname,
            uploadedAt: new Date().toISOString(),
        });
        // Save document metadata to MongoDB
        const db = (0, db_js_1.getDB)();
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
        const db = (0, db_js_1.getDB)();
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
        const db = (0, db_js_1.getDB)();
        const document = await db.collection('documents').findOne({
            _id: new mongodb_1.ObjectId(id)
        });
        if (!document) {
            return res.status(404).json({ success: false, error: '문서를 찾을 수 없습니다.' });
        }
        // Delete file
        const doc = document;
        const filePath = path_1.default.join(process.cwd(), 'uploads', doc.filename);
        try {
            await promises_1.default.unlink(filePath);
        }
        catch (e) {
            console.log('File already deleted or not found');
        }
        // Delete from MongoDB
        await db.collection('documents').deleteOne({ _id: new mongodb_1.ObjectId(id) });
        // TODO: Delete from vector database
        res.json({ success: true, message: '문서가 삭제되었습니다.' });
    }
    catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ success: false, error: '문서 삭제 실패' });
    }
});
exports.default = router;
