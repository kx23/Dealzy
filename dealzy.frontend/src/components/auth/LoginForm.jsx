import { useState } from 'react';
import { authService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [unconfirmed, setUnconfirmed] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setUnconfirmed(false);
        setLoading(true);

        try {
            const response = await authService.login(email, password);
            login(response.data.token);
            onSuccess();
        } catch (err) {
            if (err.response?.status === 403 && err.response?.data?.message === 'EMAIL_NOT_CONFIRMED') {
                setUnconfirmed(true);
            } else {
                setError('Неверный email или пароль');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="email"
                    className="form-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    className="form-input"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Входим...' : 'Войти'}
            </button>

            {error && <div className="error-message">{error}</div>}

            {unconfirmed && (
                <div className="unconfirmed-message">
                    Email не подтверждён. Проверьте почту.
                </div>
            )}

            <div className="switch-mode">
                Нет аккаунта?{' '}
                <button type="button" onClick={onSwitchToRegister}>
                    Зарегистрироваться
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
