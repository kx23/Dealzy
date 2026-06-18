import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AdDetailPage.css';

const ChevronLeft = () => (
    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
);

const ChevronRight = () => (
    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
);

const ArrowRight = () => (
    <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#136EF3" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
);

const ClockIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9aa0ad" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const AdDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePhoto, setActivePhoto] = useState(0);

    const photos = ad?.photoUrls?.length ? ad.photoUrls : [];

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await axios.get(`/api/ads/${id}`);
                setAd(response.data);
            } catch (err) {
                setError('Не удалось загрузить объявление');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchAd();
    }, [id]);

    const prevPhoto = () => setActivePhoto(i => (i - 1 + photos.length) % photos.length);
    const nextPhoto = () => setActivePhoto(i => (i + 1) % photos.length);

    if (loading) return <div className="ad-detail"><div className="ad-detail__loading">Загрузка...</div></div>;
    if (error || !ad) return (
        <div className="ad-detail">
            <div className="ad-detail__container">
                <div className="ad-detail__error">{error || 'Объявление не найдено'}</div>
                <button onClick={() => navigate('/')} style={{ color: '#136EF3', background: 'none', border: 'none', cursor: 'pointer' }}>← На главную</button>
            </div>
        </div>
    );

    const chars = [
        ad.area && { label: 'Общая площадь', value: `${ad.area} м²` },
        ad.houseArea && { label: 'Площадь дома', value: `${ad.houseArea} м²` },
        ad.landArea && { label: 'Площадь участка', value: `${ad.landArea} сот.` },
        ad.rooms && { label: 'Комнат', value: ad.rooms },
        ad.floors && { label: 'Этажей', value: ad.floors },
        ad.sellerType && { label: 'Продавец', value: ad.sellerType },
        ad.address?.city && { label: 'Город', value: ad.address.city },
    ].filter(Boolean);

    const isBuy = ad.dealType === 0;

    const conditions = isBuy ? [] : [
        ad.noDeposit != null && { label: 'Залог', value: ad.noDeposit ? 'нет' : 'есть' },
        ad.rentPeriod  && { label: 'Срок аренды', value: ad.rentPeriod === 'FromYear' ? 'от года' : 'несколько месяцев' },
    ].filter(Boolean);

    return (
        <div className="ad-detail">
            <div className="ad-detail__container">

                {/* Breadcrumbs */}
                <nav className="ad-detail__breadcrumbs">
                    {(() => {
                        const dealTypeMap = {
                            0: { label: 'Покупка', to: '/buy' },
                            1: { label: 'Аренда', to: '/rent' },
                            2: { label: 'Посуточно', to: '/daily' },
                            3: { label: 'Коммерческая аренда', to: '/commercial' },
                            4: { label: 'Коммерческая продажа', to: '/commercial' },
                        };
                        const kindMap = {
                            'Apartment': 'Квартира',
                            'Room': 'Комната',
                            'House': 'Дом, дача',
                            'Garage': 'Гараж',
                            'LandPlot': 'Участок',
                            'Office': 'Офис',
                            'Retail': 'Торговая площадь',
                            'Warehouse': 'Складское помещение',
                            'Coworking': 'Коворкинг',
                        };
                        const city = ad?.address?.city;
                        const dealInfo = ad.dealType != null ? dealTypeMap[ad.dealType] : null;
                        const kindLabel = ad.propertyKind ? kindMap[ad.propertyKind] : null;
                        return (
                            <>
                                <Link to="/">Главная</Link>
                                {city && <><span>›</span><span style={{ color: '#555' }}>Недвижимость в {city}</span></>}
                                {dealInfo && <><span>›</span><Link to={dealInfo.to}>{dealInfo.label}</Link></>}
                                {kindLabel && <><span>›</span><span style={{ color: '#555' }}>{kindLabel}</span></>}
                            </>
                        );
                    })()}
                </nav>

                {/* Page title */}
                <h1 className="ad-detail__title">{ad.title}</h1>

                {/* Main grid */}
                <div className="ad-detail__body">

                    {/* ── LEFT ── */}
                    <div className="ad-detail__left">

                        {/* Gallery */}
                        <div className="ad-detail__gallery">
                            <div className="ad-detail__main-photo-wrap">
                                {photos.length > 0
                                    ? <img src={photos[activePhoto]} alt={ad.title} />
                                    : <div className="ad-detail__no-photo">Нет фотографий</div>
                                }
                                {photos.length > 1 && (
                                    <>
                                        <button className="ad-detail__gallery-arrow ad-detail__gallery-arrow--prev" onClick={prevPhoto} aria-label="Предыдущее фото">
                                            <ChevronLeft />
                                        </button>
                                        <button className="ad-detail__gallery-arrow ad-detail__gallery-arrow--next" onClick={nextPhoto} aria-label="Следующее фото">
                                            <ChevronRight />
                                        </button>
                                        <div className="ad-detail__photo-count">
                                            📷 {photos.length} фото
                                        </div>
                                    </>
                                )}
                            </div>

                            {photos.length > 1 && (
                                <div className="ad-detail__thumbs">
                                    {photos.map((src, i) => (
                                        <div
                                            key={i}
                                            className={`ad-detail__thumb${i === activePhoto ? ' active' : ''}`}
                                            onClick={() => setActivePhoto(i)}
                                        >
                                            <img src={src} alt={`Фото ${i + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Characteristics */}
                        {chars.length > 0 && (
                            <div className="ad-detail__section">
                                <h2 className="ad-detail__section-title">Характеристики</h2>
                                <div className="ad-detail__chars">
                                    {chars.map(c => (
                                        <div className="ad-detail__char" key={c.label}>
                                            <span className="ad-detail__char-label">{c.label}</span>
                                            <span className="ad-detail__char-value">{c.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {ad.description && (
                            <div className="ad-detail__section">
                                <h2 className="ad-detail__section-title">Описание</h2>
                                <p className="ad-detail__description">{ad.description}</p>
                            </div>
                        )}

                        {/* Address */}
                        {ad.address?.displayName && (
                            <div className="ad-detail__section">
                                <h2 className="ad-detail__section-title">Адрес</h2>
                                <p style={{ margin: 0, fontFamily: 'Rubik', fontSize: 15, color: '#444' }}>
                                    {ad.address.displayName}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT ── */}
                    <div className="ad-detail__right">

                        {/* Price + conditions card */}
                        <div className="ad-detail__price-card">
                            <div className="ad-detail__price">
                                {ad.price.toLocaleString('ru-RU')} ₽
                            </div>
                            {!isBuy && <div className="ad-detail__price-period">/мес.</div>}
                            {isBuy && ad.area > 0 && (
                                <div className="ad-detail__price-per-m2">
                                    {Math.round(ad.price / ad.area).toLocaleString('ru-RU')} ₽/м²
                                </div>
                            )}

                            <button className="ad-detail__price-track-btn">
                                Следить за изменением цены
                            </button>

                            <div className="ad-detail__offer-row">
                                <input
                                    className="ad-detail__offer-input"
                                    type="text"
                                    placeholder="Предложите свою цену"
                                />
                                <button className="ad-detail__offer-submit" aria-label="Отправить предложение">
                                    <ArrowRight />
                                </button>
                            </div>

                            {conditions.length > 0 && (
                                <div className="ad-detail__conditions">
                                    {conditions.map(c => (
                                        <div className="ad-detail__condition-row" key={c.label}>
                                            <span className="ad-detail__condition-label">{c.label}</span>
                                            <span className="ad-detail__condition-value">{c.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Author card */}
                        <div className="ad-detail__author-card">
                            {/* Agency */}
                            <div className="ad-detail__agency">
                                <div className="ad-detail__agency-avatar">С</div>
                                <div className="ad-detail__agency-info">
                                    <p className="ad-detail__agency-type">Агентство недвижимости</p>
                                    <p className="ad-detail__agency-name">Спутник</p>
                                    <div className="ad-detail__agency-badge">
                                        <CheckIcon /> Документы проверены
                                    </div>
                                </div>
                            </div>

                            <div className="ad-detail__agency-meta">
                                <div className="ad-detail__agency-meta-item">
                                    <span className="ad-detail__agency-meta-label">На Dealzy</span>
                                    <span className="ad-detail__agency-meta-value">5 лет</span>
                                </div>
                                <div className="ad-detail__agency-meta-item">
                                    <span className="ad-detail__agency-meta-label">Объектов в работе</span>
                                    <span className="ad-detail__agency-meta-value">87</span>
                                </div>
                            </div>

                            {/* Realtor */}
                            <div className="ad-detail__realtor" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f2f6' }}>
                                <div className="ad-detail__realtor-avatar">ПА</div>
                                <div className="ad-detail__realtor-info">
                                    <p className="ad-detail__realtor-role">Риелтор</p>
                                    <p className="ad-detail__realtor-name">Павел Апельсинов</p>
                                </div>
                            </div>

                            {/* Contact buttons */}
                            <div className="ad-detail__contact-btns">
                                <button className="ad-detail__btn-phone">Показать телефон</button>
                                <button className="ad-detail__btn-chat">Написать</button>
                            </div>
                            <div className="ad-detail__response-hint">
                                <ClockIcon /> Быстро отвечает на сообщения
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDetailPage;
