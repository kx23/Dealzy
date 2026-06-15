import React from 'react';
import './HomePage.css';
import AdsGrid from '../components/AdsGrid';

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="home-hero">
                <div className="home-hero__placeholder">
                    <span>Баннер — добавить изображение</span>
                </div>
            </div>

            <div className="home-content">
                <AdsGrid title="Свежие объявления" />
            </div>
        </div>
    );
};

export default HomePage;
