import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateAdPage from './pages/CreateAdPage/CreateAdPage';
import Navbar from './components/Navbar';
import AdDetailPage from './pages/AdDetailPage';
import CategoryPage from './pages/CategoryPage';
import BuyPage from './pages/BuyPage';
import RentPage from './pages/RentPage';
import DailyPage from './pages/DailyPage';
import CommercialPage from './pages/CommercialPage';
import ProfilePage from './pages/ProfilePage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/create" element={<CreateAdPage />} />
                <Route path="/ad/:id" element={<AdDetailPage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/buy" element={<BuyPage />} />
                <Route path="/rent" element={<RentPage />} />
                <Route path="/daily" element={<DailyPage />} />
                <Route path="/commercial" element={<CommercialPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;
