import * as XLSX from 'xlsx';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Parse document based on MIME type
export const parseDocument = async (
    buffer: Buffer,
    mimeType: string,
    filename: string
): Promise<string[]> => {
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
    } catch (error) {
        console.error('Document parsing error:', error);
        throw error;
    }
};

// Parse Excel file
const parseExcel = (buffer: Buffer): string[] => {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const results: string[] = [];

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];

        if (jsonData.length === 0) continue;

        // Get headers from first row
        const headers = (jsonData[0] as string[]) || [];

        // Process each row
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as unknown[];
            if (!row || row.length === 0) continue;

            // Build structured text from row
            const rowTexts: string[] = [];
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
const parsePDF = async (buffer: Buffer): Promise<string[]> => {
    try {
        const data = await pdfParse(buffer);
        const text = data.text.trim();

        if (!text) return [];

        // Split by pages or sections
        const sections = text
            .split(/\n{3,}/)
            .map(s => s.trim())
            .filter(s => s.length > 20);

        console.log(`📕 Parsed PDF: ${sections.length} sections`);
        return sections.length > 0 ? sections : [text];
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw error;
    }
};

// Parse Word file
const parseWord = async (buffer: Buffer): Promise<string[]> => {
    try {
        const result = await mammoth.extractRawText({ buffer });
        const text = result.value.trim();

        if (!text) return [];

        // Split by paragraphs
        const paragraphs = text
            .split(/\n{2,}/)
            .map(p => p.trim())
            .filter(p => p.length > 20);

        console.log(`📘 Parsed Word: ${paragraphs.length} paragraphs`);
        return paragraphs.length > 0 ? paragraphs : [text];
    } catch (error) {
        console.error('Word parsing error:', error);
        throw error;
    }
};

// Parse plain text file
const parseText = (buffer: Buffer): string[] => {
    const text = buffer.toString('utf-8').trim();

    if (!text) return [];

    // Split by double newlines
    const sections = text
        .split(/\n{2,}/)
        .map(s => s.trim())
        .filter(s => s.length > 10);

    console.log(`📝 Parsed text: ${sections.length} sections`);
    return sections.length > 0 ? sections : [text];
};
