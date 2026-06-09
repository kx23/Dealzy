import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import DealzyLogo from "../assets/DealzyLogo";
import NavMenu from "./NavMenu";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="site-header">
      <div className="site-header__top">
        <div className="site-header__top-inner">
          <Link to="/" className="site-header__logo">
            <DealzyLogo width={48} height={48} />
            <span className="site-header__logo-text">DEALZY</span>
          </Link>

          <div className="site-header__actions">
            {user ? (
              <>
                <Link to="/addad" className="site-header__btn site-header__btn--outline">
                  Создать объявление
                </Link>
                <button className="site-header__btn site-header__btn--ghost" onClick={logout}>
                  {user.username}
                </button>
              </>
            ) : (
              <>
                <Link to="/addad" className="site-header__btn site-header__btn--outline">
                  Создать объявление
                </Link>
                <Link to="/login" className="site-header__btn site-header__btn--filled">
                  Войти
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <NavMenu />
    </header>
  );
};

export default Navbar;
