import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './ProfilePage.css';

const TABS = [
    { id: 'ads',           label: 'Мои объявления' },
    { id: 'favorites',     label: 'Избранные' },
    { id: 'notifications', label: 'Уведомления' },
    { id: 'messages',      label: 'Сообщения' },
    { id: 'settings',      label: 'Профиль' },
];

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('settings');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [telegramNick, setTelegramNick] = useState('');
    const [contactName, setContactName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [accountType, setAccountType] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [message, setMessage] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    useEffect(() => {
        if (activeTab !== 'settings') return;

        const fetchProfile = async () => {
            setLoadingProfile(true);
            try {
                const { data } = await api.get('/profile');
                setAvatarUrl(data.avatarUrl || '');
                setPhoneNumber(data.phoneNumber || '');
                setTelegramNick(data.telegramNick || '');
                setContactName(data.contactName || '');
                setGender(data.gender || '');
                setDateOfBirth(data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : '');
                setAccountType(data.accountType || '');
            } catch {
                setMessage({ type: 'error', text: 'Не удалось загрузить профиль.' });
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [activeTab]);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingAvatar(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await api.post('/profile/upload-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAvatarUrl(data.url);
            setMessage({ type: 'success', text: 'Аватар обновлён!' });
        } catch {
            setMessage({ type: 'error', text: 'Ошибка при загрузке аватара.' });
        } finally {
            setUploadingAvatar(false);
            e.target.value = '';
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            await api.put('/profile', {
                phoneNumber,
                telegramNick,
                contactName,
                gender: gender || null,
                dateOfBirth: dateOfBirth || null,
                accountType: accountType || null
            });
            setMessage({ type: 'success', text: 'Профиль обновлён!' });

            const { data } = await api.get('/profile');
            setAvatarUrl(data.avatarUrl || '');
            setPhoneNumber(data.phoneNumber || '');
            setTelegramNick(data.telegramNick || '');
            setContactName(data.contactName || '');
            setGender(data.gender || '');
            setDateOfBirth(data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : '');
            setAccountType(data.accountType || '');
        } catch {
            setMessage({ type: 'error', text: 'Ошибка при сохранении профиля.' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="profile-layout">
            <aside className="profile-sidebar">
                <div className="profile-sidebar__user">
                    <div className="profile-sidebar__avatar">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Аватар" className="profile-sidebar__avatar-img" />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <span className="profile-sidebar__name">{user?.name}</span>
                </div>

                <nav className="profile-sidebar__nav">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`profile-sidebar__item${activeTab === tab.id ? ' profile-sidebar__item--active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="profile-content">
                <h2 className="profile-content__title">
                    {TABS.find(t => t.id === activeTab)?.label}
                </h2>

                {activeTab === 'settings' ? (
                    loadingProfile ? (
                        <div className="profile-content__placeholder">Загрузка...</div>
                    ) : (
                        <form className="profile-form" onSubmit={handleSave}>
                            <div className="profile-form__group">
                                <label className="profile-form__label">Аватар</label>
                                <div className="profile-form__avatar-preview">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Аватар" className="profile-form__avatar-img" />
                                    ) : (
                                        <div className="profile-form__avatar-placeholder">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="profile-form__avatar-actions">
                                    <button
                                        type="button"
                                        className="profile-form__upload-btn"
                                        onClick={() => document.getElementById('avatar-upload-input').click()}
                                        disabled={uploadingAvatar}
                                    >
                                        {uploadingAvatar ? 'Загрузка...' : 'Загрузить аватар'}
                                    </button>
                                    <span className="profile-form__avatar-hint">JPG, PNG или GIF. Max 5MB.</span>
                                </div>
                                <input
                                    id="avatar-upload-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className="profile-form__group">
                                <label className="profile-form__label">Номер телефона</label>
                                <input
                                    type="tel"
                                    className="profile-form__input"
                                    placeholder="+7 (999) 123-45-67"
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                />
                            </div>

                            <div className="profile-form__group">
                                <label className="profile-form__label">Telegram</label>
                                <input
                                    type="text"
                                    className="profile-form__input"
                                    placeholder="@username"
                                    value={telegramNick}
                                    onChange={e => setTelegramNick(e.target.value)}
                                />
                            </div>

                            <div className="profile-form__group">
                                <label className="profile-form__label">Контактное имя</label>
                                <input
                                    type="text"
                                    className="profile-form__input"
                                    placeholder="Как к вам обращаться"
                                    value={contactName}
                                    onChange={e => setContactName(e.target.value)}
                                />
                            </div>

                            <div className="profile-form__group">
                                <label className="profile-form__label">Тип аккаунта</label>
                                <select
                                    className="profile-form__input profile-form__select"
                                    value={accountType}
                                    onChange={e => setAccountType(e.target.value)}
                                >
                                    <option value="">Не указан</option>
                                    <option value="individual">Частное лицо</option>
                                    <option value="realtor">Риелтор</option>
                                </select>
                            </div>

                            <div className="profile-form__group">
                                <label className="profile-form__label">Пол</label>
                                <select
                                    className="profile-form__input profile-form__select"
                                    value={gender}
                                    onChange={e => setGender(e.target.value)}
                                >
                                    <option value="">Не указан</option>
                                    <option value="male">Мужской</option>
                                    <option value="female">Женский</option>
                                </select>
                            </div>

                            <div className="profile-form__group">
                                <label className="profile-form__label">Дата рождения</label>
                                <input
                                    type="date"
                                    className="profile-form__input"
                                    value={dateOfBirth}
                                    onChange={e => setDateOfBirth(e.target.value)}
                                />
                            </div>

                            {message && (
                                <div className={`profile-form__message profile-form__message--${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="profile-form__actions">
                                <button type="submit" className="profile-form__save-btn" disabled={saving}>
                                    {saving ? 'Сохранение...' : 'Сохранить'}
                                </button>
                                <button type="button" className="profile-logout-btn" onClick={handleLogout}>
                                    Выйти из аккаунта
                                </button>
                            </div>
                        </form>
                    )
                ) : (
                    <div className="profile-content__placeholder">
                        <p>Раздел в разработке.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
