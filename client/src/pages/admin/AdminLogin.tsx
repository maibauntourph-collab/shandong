import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from './AdminLayout';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const [, setLocation] = useLocation();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || '로그인에 실패했습니다.');
            }

            login(data.data.user);
            setLocation('/admin');
        } catch (err) {
            setError(err instanceof Error ? err.message : '로그인 오류');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <div className="login-card glass">
                <div className="login-header">
                    <h1>🥢 산동 레스토랑</h1>
                    <p>관리자 로그인</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="관리자 아이디"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>기본 계정: admin / admin1234</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
