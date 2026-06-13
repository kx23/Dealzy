import React from 'react';
import './DailyPage.css';
import AdsGrid from '../components/AdsGrid';

const categories = [
    { label: 'Квартира' },
    { label: 'Комната' },
    { label: 'Дом' },
    { label: 'Койко-место' },
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
    'Комната': (
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
    'Койко-место': (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="18" width="32" height="16" rx="2" stroke="#136EF3" strokeWidth="2" fill="none"/>
            <rect x="8" y="22" width="10" height="8" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <rect x="22" y="22" width="10" height="8" rx="1" stroke="#136EF3" strokeWidth="1.5" fill="none"/>
            <line x1="4" y1="14" x2="36" y2="14" stroke="#136EF3" strokeWidth="1.5"/>
            <line x1="20" y1="14" x2="20" y2="18" stroke="#136EF3" strokeWidth="1.5"/>
        </svg>
    ),
};

const DailyPage = () => {
    return (
        <>
            <div className="daily-page__hero">
                <div className="daily-page__cards">
                    {categories.map((cat) => (
                        <div key={cat.label} className="daily-card__wrap">
                            <div className="daily-card">
                                <div className="daily-card__header">
                                    <div className="daily-card__icon">{icons[cat.label]}</div>
                                    <span className="daily-card__title">{cat.label}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        <AdsGrid dealTypes={[2]} title="Посуточная аренда" />
    </>
    );
};

export default DailyPage;
