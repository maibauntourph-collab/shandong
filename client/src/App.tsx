import { Route, Switch, useLocation } from 'wouter';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import ChatWidget from './components/chatbot/ChatWidget';
import Home from './pages/Home';
import Services from './pages/Services';
import Quote from './pages/Quote';
import Contact from './pages/Contact';
import AdminApp from './pages/admin/AdminLayout';

function AppContent() {
    const [location] = useLocation();
    const isAdminRoute = location.startsWith('/admin');

    // Admin 페이지는 별도 레이아웃 사용
    if (isAdminRoute) {
        return <AdminApp />;
    }

    return (
        <div className="app">
            <Navigation />
            <main className="main-content">
                <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/services" component={Services} />
                    <Route path="/quote" component={Quote} />
                    <Route path="/contact" component={Contact} />
                </Switch>
            </main>
            <Footer />
            <ChatWidget />
        </div>
    );
}

function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

export default App;

