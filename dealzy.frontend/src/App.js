import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddAdPage from './pages/AddAdPage';
import Navbar from './components/Navbar';
import AdDetailPage from './pages/AdDetailPage';
import CategoryPage from './pages/CategoryPage';
import BuyPage from './pages/BuyPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/addad" element={<AddAdPage />} />
                <Route path="/ad/:id" element={<AdDetailPage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/buy" element={<BuyPage />} />
            </Routes>
        </Router>
    );
}

export default App;
