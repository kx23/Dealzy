import React from 'react';
import { Link } from 'react-router-dom';
import './RentPage.css';
import AdsGrid from '../components/AdsGrid';

const categories = [
    {
        label: 'Квартира',
        sub: [],
    },
    {
        label: 'Часть квартиры',
        sub: [
            { label: 'Комната', to: '/catalog?type=rent&kind=room' },
            { label: 'Койко-место', to: '/catalog?type=rent&kind=bed' },
        ],
    },
    {
        label: 'Дом',
        sub: [
            { label: 'Дом, дача', to: '/catalog?type=rent&kind=house' },
            { label: 'Часть дома', to: '/catalog?type=rent&kind=house-part' },
            { label: 'Таунхаус', to: '/catalog?type=rent&kind=townhouse' },
        ],
    },
    {
        label: 'Гараж',
        sub: [],
    },
];

const icons = {
    'Квартира': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="14" width="30" height="22" rx="2" stroke="#136EF3" strokeWidth="2" fill="none"/>
            <path d="M2 16L20 4L38 16" stroke="#136EF3" strokeWidth="2" strokeLinecap="round"/>
            <rect x="14" y="24" width="12" height="12" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <line x1="20" y1="24" x2="20" y2="36" stroke="#136EF3" strokeWidth="1.5"/>
        </svg>
    ),
    'Часть квартиры': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="10" width="30" height="26" rx="2" stroke="#136EF3" strokeWidth="2" fill="none"/>
            <line x1="5" y1="22" x2="35" y2="22" stroke="#136EF3" strokeWidth="1.5"/>
            <rect x="12" y="26" width="8" height="10" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <rect x="10" y="13" width="12" height="7" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
        </svg>
    ),
    'Дом': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18L20 6L36 18V36H4V18Z" stroke="#136EF3" strokeWidth="2" fill="none" strokeLinejoin="round"/>
            <rect x="15" y="26" width="10" height="10" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <rect x="8" y="20" width="8" height="7" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <rect x="24" y="20" width="8" height="7" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
        </svg>
    ),
    'Гараж': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="12" width="32" height="24" rx="2" stroke="#136EF3" strokeWidth="2" fill="none"/>
            <path d="M4 12L20 4L36 12" stroke="#136EF3" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4" y1="20" x2="36" y2="20" stroke="#136EF3" strokeWidth="1.5"/>
            <line x1="4" y1="26" x2="36" y2="26" stroke="#136EF3" strokeWidth="1.5"/>
            <line x1="4" y1="32" x2="36" y2="32" stroke="#136EF3" strokeWidth="1.5"/>
        </svg>
    ),
};

const RentPage = () => {
    return (
        <>
            <div className="rent-page__hero">
                <div className="rent-page__cards">
                    {categories.map((cat) => (
                        <div key={cat.label} className="rent-card__wrap">
                            <div className="rent-card">
                                <div className="rent-card__header">
                                    <div className="rent-card__icon">{icons[cat.label]}</div>
                                    <span className="rent-card__title">{cat.label}</span>
                                </div>
                                {cat.sub.length > 0 && (
                                    <ul className="rent-card__sub">
                                        {cat.sub.map((s) => (
                                            <li key={s.label}>
                                                <Link to={s.to} className="rent-card__sub-link">{s.label}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        <AdsGrid dealTypes={[1]} title="Объявления об аренде" />
        </>
    );
};

export default RentPage;
