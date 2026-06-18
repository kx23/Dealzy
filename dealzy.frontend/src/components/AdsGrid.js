import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdsGrid.css';

const AdsGrid = ({ dealTypes, title }) => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams();
        dealTypes?.forEach(t => params.append('dealType', t));

        axios.get(`/api/ads?${params.toString()}`)
            .then(res => setAds(res.data))
            .catch(() => setAds([]))
            .finally(() => setLoading(false));
    }, [dealTypes]);

    return (
        <div className="ads-grid">
            {title && <h2 className="ads-grid__title">{title}</h2>}
            {loading
                ? <div className="ads-grid__loading">Загрузка...</div>
                : ads.length === 0
                    ? <div className="ads-grid__empty">Объявлений пока нет</div>
                    : (
                        <div className="ads-grid__list">
                            {ads.map(ad => (
                                <Link key={ad.id} to={`/ad/${ad.id}`} className="ad-card">
                                    {ad.mainPhotoUrl
                                        ? <img className="ad-card__photo" src={ad.mainPhotoUrl} alt={ad.title} />
                                        : <div className="ad-card__photo--placeholder">Нет фото</div>
                                    }
                                    <div className="ad-card__body">
                                        <span className="ad-card__kind">{ad.propertyKind}</span>
                                        <span className="ad-card__price">{ad.price.toLocaleString('ru-RU')} ₽</span>
                                        <span className="ad-card__title">{ad.title}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )
            }
        </div>
    );
};

export default AdsGrid;
