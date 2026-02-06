import { Route, Switch, useLocation, Redirect } from 'wouter';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminInquiries from './AdminInquiries';
import AdminDocuments from './AdminDocuments';
import AdminCustomers from './AdminCustomers';
import AdminNotices from './AdminNotices';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

// Auth Context
interface AuthContextType {
    isAuthenticated: boolean;
    user: { username: string; role: string } | null;
    login: (user: { username: string; role: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

// Auth Provider
const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    useEffect(() => {
        // Check for saved auth
        const savedAuth = localStorage.getItem('adminAuth');
        if (savedAuth) {
            try {
                const parsed = JSON.parse(savedAuth);
                setIsAuthenticated(true);
                setUser(parsed.user);
            } catch (e) {
                localStorage.removeItem('adminAuth');
            }
        }
    }, []);

    const login = (userData: { username: string; role: string }) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('adminAuth', JSON.stringify({ user: userData }));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('adminAuth');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Protected Route
const ProtectedRoute = ({ component: Component }: { component: React.FC }) => {
    const { isAuthenticated } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            setLocation('/admin/login');
        }
    }, [isAuthenticated, setLocation]);

    if (!isAuthenticated) {
        return null;
    }

    return <Component />;
};

const AdminLayout = () => {
    const { isAuthenticated } = useAuth();
    const [location] = useLocation();
    const isLoginPage = location === '/admin/login';

    return (
        <div className="admin-layout">
            {isAuthenticated && !isLoginPage && <AdminSidebar />}
            <div className={`admin-main ${isAuthenticated && !isLoginPage ? 'with-sidebar' : ''}`}>
                <Switch>
                    <Route path="/admin/login" component={AdminLogin} />
                    <Route path="/admin">
                        <ProtectedRoute component={AdminDashboard} />
                    </Route>
                    <Route path="/admin/inquiries">
                        <ProtectedRoute component={AdminInquiries} />
                    </Route>
                    <Route path="/admin/documents">
                        <ProtectedRoute component={AdminDocuments} />
                    </Route>
                    <Route path="/admin/customers">
                        <ProtectedRoute component={AdminCustomers} />
                    </Route>
                    <Route path="/admin/notices">
                        <ProtectedRoute component={AdminNotices} />
                    </Route>
                    <Route>
                        <Redirect to="/admin" />
                    </Route>
                </Switch>
            </div>
        </div>
    );
};

const AdminApp = () => {
    return (
        <AuthProvider>
            <AdminLayout />
        </AuthProvider>
    );
};

export default AdminApp;
