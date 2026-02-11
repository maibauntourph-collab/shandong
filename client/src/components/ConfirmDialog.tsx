import React, { useState } from 'react';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'danger';
    confirmLabel?: string;
    cancelLabel?: string;
    /** For danger actions: user must type this text to confirm */
    typeToConfirm?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    severity,
    confirmLabel = '확인',
    cancelLabel = '취소',
    typeToConfirm,
    onConfirm,
    onCancel,
}) => {
    const [typedText, setTypedText] = useState('');

    if (!isOpen) return null;

    const canConfirm = typeToConfirm ? typedText === typeToConfirm : true;

    const handleConfirm = () => {
        if (!canConfirm) return;
        setTypedText('');
        onConfirm();
    };

    const handleCancel = () => {
        setTypedText('');
        onCancel();
    };

    const severityConfig = {
        info: { icon: 'ℹ️', color: '#3B82F6', bg: '#EFF6FF' },
        warning: { icon: '⚠️', color: '#F59E0B', bg: '#FFFBEB' },
        danger: { icon: '🚨', color: '#EF4444', bg: '#FEF2F2' },
    };

    const config = severityConfig[severity];

    return (
        <div className="confirm-overlay" onClick={handleCancel}>
            <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
                <div
                    className="confirm-header"
                    style={{ borderLeftColor: config.color, backgroundColor: config.bg }}
                >
                    <span className="confirm-icon">{config.icon}</span>
                    <h3>{title}</h3>
                </div>

                <div className="confirm-body">
                    <p>{message}</p>
                    {typeToConfirm && (
                        <div className="confirm-type-check">
                            <p className="type-label">
                                확인하려면 <strong>"{typeToConfirm}"</strong> 을(를) 입력하세요:
                            </p>
                            <input
                                type="text"
                                value={typedText}
                                onChange={e => setTypedText(e.target.value)}
                                placeholder={typeToConfirm}
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                <div className="confirm-actions">
                    <button className="confirm-btn cancel" onClick={handleCancel}>
                        {cancelLabel}
                    </button>
                    <button
                        className={`confirm-btn ${severity}`}
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
