import React from 'react';
import { Link } from 'react-router-dom';
import './CommercialPage.css';
import AdsGrid from '../components/AdsGrid';

const categories = [
    {
        label: 'Аренда',
        sub: [
            { label: 'Офис', to: '/catalog?type=commercial-rent&kind=office' },
            { label: 'Коворкинг', to: '/catalog?type=commercial-rent&kind=coworking' },
            { label: 'Торговая площадь', to: '/catalog?type=commercial-rent&kind=retail' },
            { label: 'Складское помещение', to: '/catalog?type=commercial-rent&kind=warehouse' },
        ],
    },
    {
        label: 'Продажа',
        sub: [
            { label: 'Офис', to: '/catalog?type=commercial-buy&kind=office' },
            { label: 'Торговая площадь', to: '/catalog?type=commercial-buy&kind=retail' },
            { label: 'Складское помещение', to: '/catalog?type=commercial-buy&kind=warehouse' },
            { label: 'Бизнес', to: '/catalog?type=commercial-buy&kind=business' },
        ],
    },
];

const icons = {
    'Аренда': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="14" width="32" height="20" rx="2" stroke="#136EF3" strokeWidth="2" fill="none"/>
            <path d="M4 20L20 8L36 20" stroke="#136EF3" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="20" cy="28" r="4" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <path d="M20 24V26" stroke="#136EF3" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M20 30V32" stroke="#136EF3" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
    'Продажа': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="16" stroke="#136EF3" strokeWidth="2" fill="none"/>
            <path d="M14 16C14 14.8954 14.8954 14 16 14H24C25.1046 14 26 14.8954 26 16V18C26 19.1046 25.1046 20 24 20H16C14.8954 20 14 20.8954 14 22V24C14 25.1046 14.8954 26 16 26H24C25.1046 26 26 25.1046 26 24" stroke="#136EF3" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="10" x2="20" y2="14" stroke="#136EF3" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="26" x2="20" y2="30" stroke="#136EF3" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
};

const CommercialPage = () => {
    return (
        <>
            <div className="commercial-page__hero">
                <img src="/images/banner.jpg" alt="banner" className="commercial-page__hero-img" />
                <div className="commercial-page__cards">
                    {categories.map((cat) => (
                        <div key={cat.label} className="commercial-card__wrap">
                            <div className="commercial-card">
                                <div className="commercial-card__header">
                                    <div className="commercial-card__icon">{icons[cat.label]}</div>
                                    <span className="commercial-card__title">{cat.label}</span>
                                </div>
                                {cat.sub.length > 0 && (
                                    <ul className="commercial-card__sub">
                                        {cat.sub.map((s) => (
                                            <li key={s.label}>
                                                <Link to={s.to} className="commercial-card__sub-link">{s.label}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        <AdsGrid dealTypes={[3, 4]} title="Коммерческая недвижимость" />
    </>
    );
};

export default CommercialPage;
