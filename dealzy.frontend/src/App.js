import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddAdPage from "./pages/AddAdPage";
import Navbar from "./components/Navbar";
import AdDetailPage from "./pages/AdDetailPage";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/addad" element={<AddAdPage />} />
                    <Route path="/ad/:id" element={<AdDetailPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
