import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../../lib/api';

const AdminDocuments = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/api/documents');
            const data = await response.json();
            if (data.success) {
                setDocuments(data.data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);

        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await api.postFormData('/api/documents/upload', formData);
                const data = await response.json();

                if (data.success) {
                    setUploadProgress((prev) => prev + (100 / acceptedFiles.length));
                }
            } catch (error) {
                console.error('Upload error:', error);
            }
        }

        setIsUploading(false);
        setUploadProgress(0);
        fetchDocuments();
    }, []);

    const deleteDocument = async (id: string) => {
        if (!confirm('이 문서를 삭제하시겠습니까?')) return;

        try {
            const response = await api.delete(`/api/documents/${id}`);

            if (response.ok) {
                fetchDocuments();
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
            'text/plain': ['.txt'],
        },
    });

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getFileIcon = (mimetype: string) => {
        if (mimetype.includes('pdf')) return '📕';
        if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📊';
        if (mimetype.includes('word')) return '📘';
        return '📄';
    };

    return (
        <div className="admin-documents">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Documents / RAG <span className="sub-text">문서 관리</span></h1>
                    <p className="admin-page-subtitle">Upload documents for AI context and knowledge base.</p>
                </div>
                <div className="header-status">
                    <span className="status-badge active">{documents.length} Docs Created</span>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                className={`upload-zone ${isDragActive ? 'active' : ''} ${isUploading ? 'uploading' : ''}`}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                {isUploading ? (
                    <div className="upload-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <p>Uploading... {Math.round(uploadProgress)}%</p>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon">📤</div>
                        <p className="upload-text">
                            {isDragActive ? 'Drop file here' : 'Drag & drop or Click to upload'}
                        </p>
                        <p className="upload-hint">Supported formats: Excel, PDF, Word, TXT (Max 10MB)</p>
                    </>
                )}
            </div>

            {/* Document List */}
            <div className="admin-card">
                <div className="card-header">
                    <h3>Uploaded Documents</h3>
                </div>

                {isLoading ? (
                    <div className="admin-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="empty-state">
                        <p>No documents uploaded yet.</p>
                        <p className="hint">Uploaded documents will be used by the AI chatbot for answers.</p>
                    </div>
                ) : (
                    <div className="document-list">
                        {documents.map((doc) => (
                            <div key={doc._id} className="document-item">
                                <div className="doc-icon">{getFileIcon(doc.mimetype)}</div>
                                <div className="doc-info">
                                    <span className="doc-name" title={doc.originalName}>{doc.originalName}</span>
                                    <span className="doc-meta">
                                        {formatSize(doc.size)} · {doc.chunkCount} chunks
                                        <br />
                                        {formatDate(doc.uploadedAt)}
                                    </span>
                                </div>
                                <button
                                    className="doc-delete"
                                    onClick={() => deleteDocument(doc._id)}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="info-card">
                <h4>💡 Vector Database (RAG)</h4>
                <p>
                    Uploaded documents are converted into vectors (numbers) for AI understanding.
                    When a customer asks a question, the AI retrieves relevant info from here to generate accurate answers.
                    <br />
                    <span className="text-muted text-xs">(문서는 AI가 학습하여 답변에 활용합니다)</span>
                </p>
            </div>
        </div>
    );
};

export default AdminDocuments;
