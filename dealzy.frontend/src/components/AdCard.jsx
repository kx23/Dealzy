import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './AdCard.css';

const KIND_LABELS = {
    Apartment:  'Квартира',
    Room:       'Комната',
    House:      'Дом',
    HousePart:  'Часть дома',
    Townhouse:  'Таунхаус',
    Bed:        'Койко-место',
    Garage:     'Гараж',
    LandPlot:   'Участок',
    Office:     'Офис',
    Retail:     'Торговая площадь',
    Warehouse:  'Склад',
    Coworking:  'Коворкинг',
    Business:   'Бизнес',
};

const SELLER_LABELS = {
    0: 'Собственник',
    1: 'Агент',
    2: 'Застройщик',
};

function formatPrice(price) {
    if (price == null) return '—';
    return price.toLocaleString('ru-RU') + ' ₽';
}

function buildSpecs(ad) {
    const parts = [];
    if (ad.rooms)          parts.push(`${ad.rooms}-комн.`);
    if (ad.area)           parts.push(`${ad.area} м²`);
    if (ad.floor != null && ad.buildingFloors != null)
        parts.push(`${ad.floor}/${ad.buildingFloors} эт.`);
    else if (ad.floor != null)
        parts.push(`${ad.floor} эт.`);
    else if (ad.buildingFloors != null)
        parts.push(`${ad.buildingFloors} эт.`);
    return parts.join(' · ');
}

function CarouselPhoto({ photos, alt }) {
    const [index, setIndex] = useState(0);
    const containerRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!photos || photos.length <= 1) return;
        const rect = containerRef.current.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const newIndex = Math.min(
            photos.length - 1,
            Math.floor(ratio * photos.length)
        );
        setIndex(newIndex);
    }, [photos]);

    const handleMouseLeave = useCallback(() => setIndex(0), []);

    const src = photos?.[index];

    return (
        <div
            className="ad-card__photo-wrap"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {src
                ? <img className="ad-card__photo" src={src} alt={alt} />
                : <div className="ad-card__photo--placeholder">Нет фото</div>
            }
            {photos && photos.length > 1 && (
                <div className="ad-card__dots">
                    {photos.map((_, i) => (
                        <span
                            key={i}
                            className={`ad-card__dot${i === index ? ' ad-card__dot--active' : ''}`}
                        />
                    ))}
                </div>
            )}
            {photos && photos.length > 0 && (
                <span className="ad-card__photo-count">{photos.length}</span>
            )}
        </div>
    );
}

function FavoriteBtn() {
    const [active, setActive] = useState(false);
    return (
        <button
            className={`ad-card__fav${active ? ' ad-card__fav--active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActive(v => !v); }}
            title="В избранное"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
}

export default function AdCard({ ad, view = 'grid' }) {
    const specs = buildSpecs(ad);
    const kindLabel = KIND_LABELS[ad.propertyKind] ?? ad.propertyKind;
    const sellerLabel = ad.sellerType != null ? SELLER_LABELS[ad.sellerType] : null;
    const address = ad.addressDisplay || ad.city || null;

    if (view === 'list') {
        return (
            <Link to={`/ad/${ad.id}`} className="ad-card ad-card--list">
                <CarouselPhoto photos={ad.photoUrls} alt={ad.title} />
                <div className="ad-card__body">
                    <div className="ad-card__header">
                        <div className="ad-card__title-wrap">
                            <span className="ad-card__title">{ad.title}</span>
                        </div>
                        <FavoriteBtn />
                    </div>
                    <span className="ad-card__price">{formatPrice(ad.price)}</span>
                    {specs && <span className="ad-card__specs">{specs}</span>}
                    {address && <span className="ad-card__address">{address}</span>}
                    {ad.description && (
                        <p className="ad-card__description">{ad.description}</p>
                    )}
                    {(ad.authorName || sellerLabel) && (
                        <span className="ad-card__author">
                            {[ad.authorName, sellerLabel].filter(Boolean).join(' · ')}
                        </span>
                    )}
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/ad/${ad.id}`} className="ad-card ad-card--grid">
            <div className="ad-card__photo-container">
                <CarouselPhoto photos={ad.photoUrls} alt={ad.title} />
                <FavoriteBtn />
            </div>
            <div className="ad-card__body">
                <span className="ad-card__title">{ad.title}</span>
                <span className="ad-card__price">{formatPrice(ad.price)}</span>
                {specs && <span className="ad-card__specs">{specs}</span>}
                {address && <span className="ad-card__address">{address}</span>}
            </div>
        </Link>
    );
}
