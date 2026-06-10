import { useRef, useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthModal.css';

const TITLES = {
    login: 'Вход',
    signup: 'Регистрация',
};

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const mouseDownTarget = useRef(null);
    const [mode, setMode] = useState(initialMode);

    if (!isOpen) return null;

    const handleMouseDown = (e) => { mouseDownTarget.current = e.target; };
    const handleMouseUp = (e) => {
        if (mouseDownTarget.current === e.target && e.target.className === 'auth-modal-overlay') {
            onClose();
        }
        mouseDownTarget.current = null;
    };

    return (
        <div className="auth-modal-overlay" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <div className="auth-modal-header">
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>

                <h2>{TITLES[mode]}</h2>

                {mode === 'login' && (
                    <LoginForm
                        onSuccess={onClose}
                        onSwitchToRegister={() => setMode('signup')}
                    />
                )}
                {mode === 'signup' && (
                    <RegisterForm
                        onSuccess={onClose}
                        onSwitchToLogin={() => setMode('login')}
                    />
                )}
            </div>
        </div>
    );
};

export default AuthModal;
