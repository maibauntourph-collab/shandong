
import { useState } from 'react';
import { api } from '../../lib/api';
import './AdminSettings.css';

const AdminSettings = () => {
    // Load initial state from localStorage or use defaults
    const [siteTitle, setSiteTitle] = useState(() => localStorage.getItem('siteTitle') || 'Shandong Cebu');
    const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('adminEmail') || 'admin@shandong.com');
    const [language, setLanguage] = useState<'en' | 'ko'>(() => (localStorage.getItem('language') as 'en' | 'ko') || 'en');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSaveGeneral = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Save to localStorage
            localStorage.setItem('siteTitle', siteTitle);
            localStorage.setItem('adminEmail', adminEmail);
            localStorage.setItem('language', language);

            alert('General settings saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save settings.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSecurity = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.put('/api/admin/change-password', {
                currentPassword,
                newPassword
            });

            const data = await response.json();

            if (data.success) {
                alert('Password updated successfully!');
                setNewPassword('');
                setConfirmPassword('');
                setCurrentPassword('');
            } else {
                alert(data.error || 'Failed to update password.');
            }
        } catch (error) {
            console.error('Security update error:', error);
            alert('Failed to update password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-settings">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Settings <span className="sub-text">설정</span></h1>
                    <p className="admin-page-subtitle">Manage your application preferences and security.</p>
                </div>
            </div>

            {/* General Settings */}
            <section className="settings-section">
                <h2>⚙️ General Settings <span className="text-sm text-muted ml-2 font-normal">일반 설정</span></h2>
                <form onSubmit={handleSaveGeneral}>
                    <div className="form-group">
                        <label>Site Title (사이트 제목)</label>
                        <input
                            type="text"
                            value={siteTitle}
                            onChange={(e) => setSiteTitle(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Admin Email (관리자 이메일)</label>
                        <input
                            type="email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Language Preference (언어 설정)</label>
                        <div className="language-toggle">
                            <div
                                className={`lang-option ${language === 'en' ? 'active' : ''} `}
                                onClick={() => !isLoading && setLanguage('en')}
                            >
                                🇺🇸 English
                            </div>
                            <div
                                className={`lang-option ${language === 'ko' ? 'active' : ''} `}
                                onClick={() => !isLoading && setLanguage('ko')}
                            >
                                🇰🇷 한국어
                            </div>
                        </div>
                        <p className="text-sm text-muted mt-2">
                            * Current interface is set to English (Primary) / Korean (Secondary).
                        </p>
                    </div>

                    <div className="settings-actions">
                        <button type="submit" className="admin-button" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes (저장)'}
                        </button>
                    </div>
                </form>
            </section>

            {/* Security Settings */}
            <section className="settings-section">
                <h2>🔒 Security <span className="text-sm text-muted ml-2 font-normal">보안</span></h2>
                <form onSubmit={handleSaveSecurity}>
                    <div className="form-group">
                        <label>Current Password (현재 비밀번호)</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password (새 비밀번호)</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password (비밀번호 확인)</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="settings-actions">
                        <button type="submit" className="admin-button secondary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Password (비밀번호 변경)'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AdminSettings;
