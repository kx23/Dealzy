import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const TABS = [
    { id: 'ads',           label: 'Мои объявления' },
    { id: 'favorites',     label: 'Избранные' },
    { id: 'notifications', label: 'Уведомления' },
    { id: 'messages',      label: 'Сообщения' },
    { id: 'settings',      label: 'Настройки' },
];

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ads');

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="profile-layout">
            <aside className="profile-sidebar">
                <div className="profile-sidebar__user">
                    <div className="profile-sidebar__avatar">
                        {user?.name?.charAt(0).toUpperCase()}
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
                    <div className="profile-content__placeholder">
                        <p>Настройки появятся здесь.</p>
                        <button className="profile-logout-btn" onClick={handleLogout}>
                            Выйти из аккаунта
                        </button>
                    </div>
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
