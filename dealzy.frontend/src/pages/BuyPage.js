import React from 'react';
import { Link } from 'react-router-dom';
import './BuyPage.css';
import AdsGrid from '../components/AdsGrid';

const categories = [
    {
        label: 'Квартира',
        sub: [
            { label: 'Вторичный рынок', to: '/catalog?type=buy&kind=resale-apartment' },
            { label: 'Новостройка', to: '/catalog?type=buy&kind=new-apartment' },
        ],
    },
    { label: 'Комната', sub: [] },
    {
        label: 'Дом',
        sub: [
            { label: 'Дом, дача', to: '/catalog?type=buy&kind=house' },
            { label: 'Часть дома', to: '/catalog?type=buy&kind=house-part' },
            { label: 'Таунхаус', to: '/catalog?type=buy&kind=townhouse' },
            { label: 'Участок', to: '/catalog?type=buy&kind=land' },
        ],
    },
    { label: 'Гараж', sub: [] },
];

const icons = {
    'Квартира': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="5" y="14" width="30" height="22" rx="2" stroke="#136EF3" strokeWidth="2" fill="none"/>
            <path d="M2 16L20 4L38 16" stroke="#136EF3" strokeWidth="2" strokeLinecap="round"/>
            <rect x="14" y="24" width="12" height="12" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <line x1="20" y1="24" x2="20" y2="36" stroke="#136EF3" strokeWidth="1.5"/>
        </svg>
    ),
    'Комната': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="5" y="10" width="30" height="26" rx="2" stroke="#136EF3" strokeWidth="2" fill="none"/>
            <line x1="5" y1="22" x2="35" y2="22" stroke="#136EF3" strokeWidth="1.5"/>
            <rect x="12" y="26" width="8" height="10" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <rect x="10" y="13" width="12" height="7" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
        </svg>
    ),
    'Дом': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M4 18L20 6L36 18V36H4V18Z" stroke="#136EF3" strokeWidth="2" fill="none" strokeLinejoin="round"/>
            <rect x="15" y="26" width="10" height="10" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <rect x="8" y="20" width="8" height="7" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <rect x="24" y="20" width="8" height="7" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
        </svg>
    ),
    'Гараж': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="12" width="32" height="24" rx="2" stroke="#136EF3" strokeWidth="2" fill="none"/>
            <path d="M4 12L20 4L36 12" stroke="#136EF3" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4" y1="20" x2="36" y2="20" stroke="#136EF3" strokeWidth="1.5"/>
            <line x1="4" y1="26" x2="36" y2="26" stroke="#136EF3" strokeWidth="1.5"/>
            <line x1="4" y1="32" x2="36" y2="32" stroke="#136EF3" strokeWidth="1.5"/>
        </svg>
    ),
};

const BuyPage = () => (
    <>
        <div className="buy-page">
            <div className="buy-page__hero">
                <div className="buy-page__cards">
                    {categories.map((cat) => (
                        <div key={cat.label} className="buy-card__wrap">
                            <div className="buy-card">
                                <div className="buy-card__header">
                                    <div className="buy-card__icon">{icons[cat.label]}</div>
                                    <span className="buy-card__title">{cat.label}</span>
                                </div>
                                {cat.sub.length > 0 && (
                                    <ul className="buy-card__sub">
                                        {cat.sub.map((s) => (
                                            <li key={s.label}>
                                                <Link to={s.to} className="buy-card__sub-link">{s.label}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <AdsGrid dealTypes={[0]} title="Объявления о продаже" />
    </>
);

export default BuyPage;
