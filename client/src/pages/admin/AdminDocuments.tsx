import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './AdminDocuments.css';

interface Document {
    _id: string;
    originalName: string;
    mimetype: string;
    size: number;
    chunkCount: number;
    uploadedAt: string;
}

const AdminDocuments = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch('/api/documents');
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
                const response = await fetch('/api/documents/upload', {
                    method: 'POST',
                    body: formData,
                });

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
            const response = await fetch(`/api/documents/${id}`, {
                method: 'DELETE',
            });

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
                <h1 className="admin-page-title">문서/벡터DB 관리</h1>
                <p className="admin-page-subtitle">AI 챗봇이 참고할 문서를 업로드하세요</p>
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
                        <p>업로드 중... {Math.round(uploadProgress)}%</p>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon">📤</div>
                        <p className="upload-text">
                            {isDragActive ? '파일을 여기에 놓으세요' : '파일을 드래그하거나 클릭하여 업로드'}
                        </p>
                        <p className="upload-hint">지원 형식: Excel, PDF, Word, TXT (최대 10MB)</p>
                    </>
                )}
            </div>

            {/* Document List */}
            <div className="admin-card">
                <h3>업로드된 문서 ({documents.length})</h3>

                {isLoading ? (
                    <div className="loading">로딩 중...</div>
                ) : documents.length === 0 ? (
                    <div className="empty-state">
                        <p>업로드된 문서가 없습니다.</p>
                        <p className="hint">문서를 업로드하면 AI 챗봇이 내용을 학습합니다.</p>
                    </div>
                ) : (
                    <div className="document-list">
                        {documents.map((doc) => (
                            <div key={doc._id} className="document-item">
                                <div className="doc-icon">{getFileIcon(doc.mimetype)}</div>
                                <div className="doc-info">
                                    <span className="doc-name">{doc.originalName}</span>
                                    <span className="doc-meta">
                                        {formatSize(doc.size)} · {doc.chunkCount}개 청크 · {formatDate(doc.uploadedAt)}
                                    </span>
                                </div>
                                <button
                                    className="doc-delete"
                                    onClick={() => deleteDocument(doc._id)}
                                    title="삭제"
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
                <h4>💡 벡터 데이터베이스란?</h4>
                <p>
                    업로드된 문서는 AI가 이해할 수 있는 벡터(숫자) 형태로 변환되어 저장됩니다.
                    고객이 질문하면 AI가 관련 내용을 검색하여 정확한 답변을 제공합니다.
                </p>
            </div>
        </div>
    );
};

export default AdminDocuments;
