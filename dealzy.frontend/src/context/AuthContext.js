import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../api';

const AuthContext = createContext(null);

const isTokenExpired = (token) => {
    try {
        const { exp } = jwtDecode(token);
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) { setLoading(false); return; }

            let activeToken = savedToken;
            if (isTokenExpired(savedToken)) {
                try {
                    const { data } = await authService.refresh();
                    activeToken = data.token;
                    localStorage.setItem('token', activeToken);
                } catch {
                    localStorage.removeItem('token');
                    setLoading(false);
                    return;
                }
            }

            const decoded = jwtDecode(activeToken);
            setToken(activeToken);
            setUser({ id: decoded.sub, name: decoded.unique_name, email: decoded.email });
            setLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        const handleForceLogout = () => logout();
        window.addEventListener('auth:logout', handleForceLogout);
        return () => window.removeEventListener('auth:logout', handleForceLogout);
    }, []);

    useEffect(() => {
        const handle = (e) => {
            const decoded = jwtDecode(e.detail.token);
            setToken(e.detail.token);
            setUser({ id: decoded.sub, name: decoded.unique_name, email: decoded.email });
        };
        window.addEventListener('auth:tokenRefreshed', handle);
        return () => window.removeEventListener('auth:tokenRefreshed', handle);
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        const decoded = jwtDecode(newToken);
        setToken(newToken);
        setUser({ id: decoded.sub, name: decoded.unique_name, email: decoded.email });
    };

    const logout = async () => {
        try { await authService.logout(); } catch { /* ignore */ }
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    if (loading) return <div className="page-placeholder">...</div>;

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
