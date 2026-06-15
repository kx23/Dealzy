import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DealzyLogo from '../assets/DealzyLogo';
import NavMenu from './NavMenu';
import AuthModal from './auth/AuthModal';
import './Navbar.css';

const Navbar = () => {
    const { user } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);
    const navigate = useNavigate();

    const handleCreateAd = () => {
        if (user) {
            navigate('/create');
        } else {
            setAuthOpen(true);
        }
    };

    return (
        <>
            <header className="site-header">
                <div className="site-header__top">
                    <div className="site-header__top-inner">
                        <Link to="/" className="site-header__logo">
                            <DealzyLogo width={48} height={48} />
                            <span className="site-header__logo-text">DEALZY</span>
                        </Link>

                        <div className="site-header__actions">
                            <button onClick={handleCreateAd} className="site-header__btn site-header__btn--outline">
                                Создать объявление
                            </button>
                            {user ? (
                                <Link
                                    to="/profile"
                                    className="site-header__btn site-header__btn--ghost"
                                >
                                    {user.name}
                                </Link>
                            ) : (
                                <button
                                    className="site-header__btn site-header__btn--filled"
                                    onClick={() => setAuthOpen(true)}
                                >
                                    Войти
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <NavMenu />
            </header>

            <AuthModal
                isOpen={authOpen}
                onClose={() => setAuthOpen(false)}
            />
        </>
    );
};

export default Navbar;
