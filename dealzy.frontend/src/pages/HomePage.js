import React, { useEffect, useState } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5176/api/ads/search?pageSize=12`);
            if (!response.ok) throw new Error('Error loading data');
            const data = await response.json();
            setAds(data);
        } catch (error) {
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    return (
        <div className="home-page">
            <div className="home-hero">
                <div className="home-hero__placeholder">
                    <span>Баннер — добавить изображение</span>
                </div>
            </div>

            <div className="home-content">
                {loading && (
                    <div className="home-content__loading">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                    </div>
                )}

                {!loading && ads.length === 0 && (
                    <div className="home-content__empty">
                        <h4>Объявлений пока нет</h4>
                        <p>Попробуйте изменить параметры поиска</p>
                    </div>
                )}

                <div className="ads-grid">
                    {ads.map((ad) => (
                        <a href={`/ad/${ad.id}`} key={ad.id} className="ad-card">
                            <div className="ad-card__img-wrap">
                                <img
                                    src={ad.imageUrl || null}
                                    alt={ad.title}
                                    className="ad-card__img"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                            <div className="ad-card__body">
                                <div className="ad-card__price">{ad.price?.toLocaleString('ru-RU')} ₽</div>
                                <div className="ad-card__title">{ad.title}</div>
                                <div className="ad-card__desc">{ad.description}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
