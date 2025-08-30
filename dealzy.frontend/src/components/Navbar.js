import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <Link className="navbar-brand" to="/">DealZy</Link>
            <div className="ms-auto">
                {user ? (
                    <div className="d-flex align-items-center">
                        <span className="me-3">👤 {user.username}</span>
                        <button className="btn btn-outline-danger btn-sm" onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <>
                        <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
                        <Link className="btn btn-primary" to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
