import { useState } from 'react';
import { authService } from '../../api';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) { setError('Введите имя'); return; }
        if (password !== confirmPassword) { setError('Пароли не совпадают'); return; }
        if (password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return; }

        setLoading(true);
        try {
            await authService.register(name, email, password);
            setRegistered(true);
        } catch (err) {
            setError(err.response?.data?.[0]?.description || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    if (registered) return (
        <div className="auth-success-message">
            <div className="auth-success-icon">✉️</div>
            <p className="auth-success-text">Регистрация завершена!</p>
            <p className="auth-success-subtext">
                Проверьте почту {email} и подтвердите аккаунт.
            </p>
        </div>
    );

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    className="form-input"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
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
            <div className="form-group">
                <input
                    type="password"
                    className="form-input"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            {error && <div className="error-message">{error}</div>}

            <div className="switch-mode">
                Уже есть аккаунт?{' '}
                <button type="button" onClick={onSwitchToLogin}>
                    Войти
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;
