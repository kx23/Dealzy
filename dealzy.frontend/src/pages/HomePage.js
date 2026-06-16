import React from 'react';
import './HomePage.css';
import AdsGrid from '../components/AdsGrid';

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="home-hero">
                <img src="/images/banner.jpg" alt="banner" className="home-hero__img" />
            </div>

            <div className="home-content">
                <AdsGrid title="Свежие объявления" />
            </div>
        </div>
    );
};

export default HomePage;
