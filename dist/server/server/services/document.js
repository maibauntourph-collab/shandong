"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDocument = void 0;
const XLSX = __importStar(require("xlsx"));
// @ts-ignore
const pdf_parse_1 = __importDefault(require("pdf-parse"));
// @ts-ignore
const mammoth_1 = __importDefault(require("mammoth"));
// Parse document based on MIME type
const parseDocument = async (buffer, mimeType, filename) => {
    console.log(`📄 Parsing document: ${filename} (${mimeType})`);
    try {
        switch (mimeType) {
            case 'application/pdf':
                return await parsePDF(buffer);
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.ms-excel':
                return parseExcel(buffer);
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/msword':
                return await parseWord(buffer);
            case 'text/plain':
                return parseText(buffer);
            default:
                console.log(`Unsupported file type: ${mimeType}`);
                return [];
        }
    }
    catch (error) {
        console.error('Document parsing error:', error);
        throw error;
    }
};
exports.parseDocument = parseDocument;
// Parse Excel file
const parseExcel = (buffer) => {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const results = [];
    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (jsonData.length === 0)
            continue;
        // Get headers from first row
        const headers = jsonData[0] || [];
        // Process each row
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0)
                continue;
            // Build structured text from row
            const rowTexts = [];
            for (let j = 0; j < row.length; j++) {
                const value = row[j];
                if (value !== undefined && value !== null && String(value).trim()) {
                    const header = headers[j] ? `${headers[j]}: ` : '';
                    rowTexts.push(`${header}${String(value).trim()}`);
                }
            }
            if (rowTexts.length > 0) {
                results.push(rowTexts.join(', '));
            }
        }
        // Also add as continuous text for context
        const textVersion = XLSX.utils.sheet_to_txt(sheet);
        if (textVersion.trim()) {
            results.push(`[시트: ${sheetName}]\n${textVersion}`);
        }
    }
    console.log(`📊 Parsed Excel: ${results.length} content blocks`);
    return results;
};
// Parse PDF file
const parsePDF = async (buffer) => {
    try {
        const data = await (0, pdf_parse_1.default)(buffer);
        const text = data.text.trim();
        if (!text)
            return [];
        // Split by pages or sections
        const sections = text
            .split(/\n{3,}/)
            .map((s) => s.trim())
            .filter((s) => s.length > 20);
        console.log(`📕 Parsed PDF: ${sections.length} sections`);
        return sections.length > 0 ? sections : [text];
    }
    catch (error) {
        console.error('PDF parsing error:', error);
        throw error;
    }
};
// Parse Word file
const parseWord = async (buffer) => {
    try {
        const result = await mammoth_1.default.extractRawText({ buffer });
        const text = result.value.trim();
        if (!text)
            return [];
        // Split by paragraphs
        const paragraphs = text
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter((p) => p.length > 20);
        console.log(`📘 Parsed Word: ${paragraphs.length} paragraphs`);
        return paragraphs.length > 0 ? paragraphs : [text];
    }
    catch (error) {
        console.error('Word parsing error:', error);
        throw error;
    }
};
// Parse plain text file
const parseText = (buffer) => {
    const text = buffer.toString('utf-8').trim();
    if (!text)
        return [];
    // Split by double newlines
    const sections = text
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter((s) => s.length > 10);
    console.log(`📝 Parsed text: ${sections.length} sections`);
    return sections.length > 0 ? sections : [text];
};
