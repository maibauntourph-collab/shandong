import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dbConnected, setDbConnected] = useState<boolean | null>(null);
    const navigate = useNavigate();

    // Check database connection on mount
    useEffect(() => {
        checkDatabaseConnection();
    }, []);

    const checkDatabaseConnection = async () => {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();

            if (data.status === 'ok' && data.database === 'connected') {
                setDbConnected(true);
                setError('');
            } else {
                setDbConnected(false);
                setError('서버 연결에 문제가 있습니다.');
            }
        } catch (err) {
            console.error('Health check error:', err);
            setDbConnected(false);
            setError('서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인하세요.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        if (dbConnected === false) {
            setError('데이터베이스 연결 후 다시 시도해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || '로그인에 실패했습니다.');
            }

            // Store token
            localStorage.setItem('adminToken', data.data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.data.user));

            // Redirect to dashboard
            navigate('/admin/dashboard');

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || '로그인 정보가 올바르지 않습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <div className="login-card"> {/* Renamed from login-box */}
                {/* Header */}
                <div className="login-header">
                    <div className="logo-icon">🥟</div>
                    <h1>Shandong Restaurant</h1>
                    <p className="subtitle">Admin Portal</p>
                </div>

                {/* Database Status */}
                {dbConnected === null && (
                    <div className="status-banner status-loading">
                        <span className="spinner-small" style={{ borderColor: '#4B5563', borderTopColor: 'transparent' }}></span>
                        Connecting...
                    </div>
                )}

                {dbConnected === true && (
                    <div className="status-banner status-success">
                        <span>●</span> System Online
                    </div>
                )}

                {dbConnected === false && (
                    <div className="status-banner status-error">
                        ⚠️ {error}
                        <button
                            onClick={checkDatabaseConnection}
                            className="retry-button"
                            title="Retry Connection"
                        >
                            ↻
                        </button>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Username Field */}
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your admin ID"
                            disabled={loading || dbConnected === false}
                            autoComplete="username"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                disabled={loading || dbConnected === false}
                                autocomplete="current-password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading || dbConnected === false}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && dbConnected !== false && (
                        <div className="status-banner status-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading || dbConnected === false}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-small"></span>
                                Logging In...
                            </>
                        ) : (
                            'Access Dashboard'
                        )}
                    </button>

                    {/* Footer Info */}
                    <div className="login-footer">
                        <p className="default-account">
                            <strong>Demo Access:</strong> admin / admin1234
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;