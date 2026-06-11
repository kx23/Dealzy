import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DealzyLogo from '../assets/DealzyLogo';
import NavMenu from './NavMenu';
import AuthModal from './auth/AuthModal';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);

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
                            <Link to="/create" className="site-header__btn site-header__btn--outline">
                                Создать объявление
                            </Link>
                            {user ? (
                                <button
                                    className="site-header__btn site-header__btn--ghost"
                                    onClick={logout}
                                >
                                    {user.name}
                                </button>
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
