import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './CatalogPage.css';
import AdCard from '../components/AdCard';

const DEAL_TYPE_MAP = {
    '0': { label: 'Покупка', to: '/buy' },
    '1': { label: 'Аренда', to: '/rent' },
    '2': { label: 'Посуточно', to: '/daily' },
    '3': { label: 'Коммерческая', to: '/commercial' },
    '4': { label: 'Коммерческая', to: '/commercial' },
};

const KIND_LABELS = {
    Apartment: 'Квартира',
    Room: 'Комната',
    House: 'Дом, дача',
    HousePart: 'Часть дома',
    Townhouse: 'Таунхаус',
    Bed: 'Койко-место',
    Garage: 'Гараж',
    LandPlot: 'Участок',
    Office: 'Офис',
    Retail: 'Торговая площадь',
    Warehouse: 'Склад',
    Coworking: 'Коворкинг',
    Business: 'Бизнес',
};

const KIND_OPTIONS_BY_DEAL = {
    '0': ['Apartment', 'Room', 'House', 'HousePart', 'Townhouse', 'LandPlot', 'Garage'],
    '1': ['Apartment', 'Room', 'Bed', 'House', 'HousePart', 'Townhouse', 'Garage'],
    '2': ['Apartment', 'Room', 'House', 'Bed'],
    '3': ['Office', 'Coworking', 'Retail', 'Warehouse'],
    '4': ['Office', 'Retail', 'Warehouse', 'Business'],
};

const getKindOptions = (dealType) => [
    { value: '', label: 'Все типы' },
    ...(KIND_OPTIONS_BY_DEAL[dealType] ?? []).map(value => ({ value, label: KIND_LABELS[value] })),
];

const DEAL_OPTIONS = [
    { value: '0', label: 'Купить' },
    { value: '1', label: 'Снять' },
    { value: '2', label: 'Посуточно' },
    { value: '3', label: 'Коммерческая аренда' },
    { value: '4', label: 'Коммерческая продажа' },
];

const ROOMS_OPTIONS = [
    { value: '', label: 'Комнат — любое' },
    { value: '1', label: '1 комната' },
    { value: '2', label: '2 комнаты' },
    { value: '3', label: '3 комнаты' },
    { value: '4', label: '4+ комнаты' },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Самые новые' },
    { value: 'price_asc', label: 'Цена ↑' },
    { value: 'price_desc', label: 'Цена ↓' },
];

// --- Extra filters config by dealType + kind ---
const EXTRA_FILTERS = {
    Apartment: {
        base: [
            { key: 'objectType', label: 'Тип объекта', options: [['', 'Любой'], ['0', 'Неважно'], ['1', 'Новостройка'], ['2', 'Вторичка']] },
            { key: 'renovationType', label: 'Ремонт', options: [['', 'Любой'], ['0', 'Без ремонта'], ['1', 'Косметический'], ['2', 'Евро'], ['3', 'Дизайнерский']] },
            { key: 'buildingType', label: 'Тип дома', options: [['', 'Любой'], ['0', 'Кирпич'], ['2', 'Монолит'], ['3', 'Панель'], ['4', 'Блок'], ['5', 'Кирпич-монолит'], ['6', 'Сталинский']] },
            { key: 'bathroomType', label: 'Санузел', options: [['', 'Любой'], ['0', 'Совмещённый'], ['1', 'Раздельный']] },
            { key: 'balconyType', label: 'Балкон', options: [['', 'Любой'], ['0', 'Нет'], ['1', 'Балкон'], ['2', 'Лоджия']] },
            { key: 'parkingType', label: 'Парковка', options: [['', 'Любой'], ['0', 'Наземная'], ['1', 'Многоуровневая'], ['2', 'Подземная']] },
            { key: 'elevatorType', label: 'Лифт', options: [['', 'Любой'], ['0', 'Нет'], ['1', 'Есть'], ['2', 'Грузовой']] },
        ],
        area: ['totalArea', 'livingArea', 'kitchenArea'],
        floor: true,
    },
    Room: {
        base: [
            { key: 'renovationType', label: 'Ремонт', options: [['', 'Любой'], ['0', 'Без ремонта'], ['1', 'Косметический'], ['2', 'Евро'], ['3', 'Дизайнерский']] },
            { key: 'buildingType', label: 'Тип дома', options: [['', 'Любой'], ['0', 'Кирпич'], ['2', 'Монолит'], ['3', 'Панель'], ['4', 'Блок']] },
            { key: 'bathroomType', label: 'Санузел', options: [['', 'Любой'], ['0', 'Совмещённый'], ['1', 'Раздельный']] },
        ],
        area: ['totalArea'],
        floor: true,
    },
    House: {
        base: [
            { key: 'material', label: 'Материал', options: [['', 'Любой'], ['0', 'Кирпич'], ['1', 'Дерево'], ['2', 'Монолит'], ['3', 'Панель'], ['4', 'Каркас'], ['5', 'Газоблок']] },
            { key: 'landStatus', label: 'Назначение', options: [['', 'Любое'], ['0', 'ИЖС'], ['1', 'СНТ'], ['2', 'ДНП'], ['3', 'ЛПХ']] },
            { key: 'heatingType', label: 'Отопление', options: [['', 'Любое'], ['0', 'Центр. газ'], ['4', 'Электро'], ['5', 'Авт. газ'], ['8', 'Нет']] },
        ],
        area: ['houseArea', 'landArea'],
        booleans: [
            { key: 'hasGarage', label: 'Гараж' },
            { key: 'hasPool', label: 'Бассейн' },
            { key: 'hasBanya', label: 'Баня' },
        ],
    },
    LandPlot: {
        base: [
            { key: 'landStatus', label: 'Назначение', options: [['', 'Любое'], ['0', 'ИЖС'], ['1', 'СНТ'], ['2', 'ДНП'], ['3', 'ЛПХ']] },
        ],
        area: ['totalArea'],
    },
    Garage: {
        base: [
            { key: 'garageType', label: 'Тип', options: [['', 'Любой'], ['0', 'Гараж'], ['1', 'Машиноместо'], ['2', 'Бокс']] },
            { key: 'parkingType', label: 'Парковка', options: [['', 'Любая'], ['0', 'Наземная'], ['1', 'Многоуровневая'], ['2', 'Подземная']] },
        ],
    },
    Office: {
        base: [
            { key: 'officeClass', label: 'Класс', options: [['', 'Любой'], ['0', 'A'], ['1', 'B'], ['2', 'C']] },
            { key: 'officeCondition', label: 'Состояние', options: [['', 'Любое'], ['0', 'Офисная отделка'], ['1', 'Предчистовая'], ['2', 'Требует ремонта']] },
            { key: 'accessMode', label: 'Доступ', options: [['', 'Любой'], ['0', 'Свободный'], ['1', 'По пропускам']] },
        ],
        area: ['totalArea'],
    },
    Retail: {
        base: [
            { key: 'spaceType', label: 'Тип помещения', options: [['', 'Любой'], ['0', 'Торговый зал'], ['1', 'Бутик']] },
            { key: 'entranceType', label: 'Вход', options: [['', 'Любой'], ['0', 'Отдельный'], ['1', 'С улицы'], ['2', 'Из ТЦ']] },
            { key: 'retailCondition', label: 'Состояние', options: [['', 'Любое'], ['0', 'Хорошее'], ['1', 'Требует ремонта']] },
        ],
        area: ['totalArea'],
    },
    Warehouse: {
        base: [
            { key: 'warehouseClass', label: 'Класс', options: [['', 'Любой'], ['0', 'A'], ['1', 'B'], ['2', 'C'], ['3', 'D']] },
            { key: 'warehouseCondition', label: 'Состояние', options: [['', 'Любое'], ['0', 'Хорошее'], ['1', 'Требует ремонта']] },
            { key: 'heatingType', label: 'Отопление', options: [['', 'Любое'], ['0', 'Центральное'], ['1', 'Нет']] },
        ],
        area: ['totalArea'],
    },
    Coworking: {
        base: [
            { key: 'access', label: 'Доступ', options: [['', 'Любой'], ['0', '24/7'], ['1', 'По расписанию']] },
        ],
        area: ['totalArea'],
    },
};

// rent-only extras appended when dealType = 1 or 2
const RENT_EXTRA = [
    { key: 'rentPeriod', label: 'Срок аренды', options: [['', 'Любой'], ['0', 'От года'], ['1', 'Несколько месяцев']] },
    { key: 'noDeposit', label: 'Без залога', boolean: true },
];

// --- Icons ---
const GridIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
);

const ListIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="14" height="6" rx="1" />
        <rect x="1" y="9" width="14" height="6" rx="1" />
    </svg>
);

const MapIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="7" r="3" />
        <path d="M8 1C5.24 1 3 3.24 3 6c0 3.5 5 9 5 9s5-5.5 5-9c0-2.76-2.24-5-5-5z" />
    </svg>
);

const ChevronDown = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 4l4 4 4-4" />
    </svg>
);

// --- City search input with suggest ---
const CitySearch = ({ value, coords, onChange }) => {
    const [query, setQuery] = useState(value?.name ?? '');
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const timer = useRef(null);
    const wrapRef = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleInput = (e) => {
        const v = e.target.value;
        setQuery(v);
        clearTimeout(timer.current);
        if (v.length < 2) { setSuggestions([]); setOpen(false); return; }
        timer.current = setTimeout(async () => {
            try {
                const res = await axios.get('/api/geocoding/search-city', { params: { query: v } });
                setSuggestions(res.data ?? []);
                setOpen(true);
            } catch { setSuggestions([]); }
        }, 300);
    };

    const handleSelect = (s) => {
        setQuery(s.displayName);
        setSuggestions([]);
        setOpen(false);
        onChange({ name: s.displayName, lon: s.longitude, lat: s.latitude });
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        onChange(null);
    };

    return (
        <div className="city-search" ref={wrapRef}>
            <span className="city-search__icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#136EF3" strokeWidth="1.8">
                    <circle cx="6" cy="6" r="4.5" /><path d="M10 10l2.5 2.5" />
                </svg>
            </span>
            <input
                className="city-search__input"
                placeholder="Город"
                value={query}
                onChange={handleInput}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
            />
            {query && (
                <button className="city-search__clear" onClick={handleClear}>×</button>
            )}
            {open && suggestions.length > 0 && (
                <ul className="city-search__dropdown">
                    {suggestions.map((s, i) => (
                        <li key={i} className="city-search__option" onMouseDown={() => handleSelect(s)}>
                            {s.displayName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- Price dropdown ---
const PriceDropdown = ({ priceFrom, priceTo, onChange }) => {
    const [open, setOpen] = useState(false);
    const [from, setFrom] = useState(priceFrom);
    const [to, setTo] = useState(priceTo);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const apply = () => { onChange(from, to); setOpen(false); };
    const hasValue = priceFrom || priceTo;

    return (
        <div className="price-dropdown" ref={ref}>
            <button
                className={`filter-chip${hasValue ? ' filter-chip--active' : ''}`}
                onClick={() => setOpen(o => !o)}
            >
                {hasValue ? `${priceFrom || ''}–${priceTo || ''} ₽` : 'Цена'}
                <ChevronDown />
            </button>
            {open && (
                <div className="price-dropdown__panel">
                    <input
                        type="number"
                        className="price-dropdown__input"
                        placeholder="от"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                    />
                    <span className="price-dropdown__rub">₽</span>
                    <input
                        type="number"
                        className="price-dropdown__input"
                        placeholder="до"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                    />
                    <span className="price-dropdown__rub">₽</span>
                    <button className="price-dropdown__apply" onClick={apply}>за всё</button>
                </div>
            )}
        </div>
    );
};

// --- Extra filters popup ---
const ExtraFiltersPopup = ({ dealType, kind, filters, priceFrom, priceTo, rooms, withPhoto, noAgent, onApply, onClose }) => {
    const [local, setLocal] = useState({ ...filters });
    const [priceFromLocal, setPriceFromLocal] = useState(priceFrom);
    const [priceToLocal, setPriceToLocal] = useState(priceTo);
    const [roomsLocal, setRoomsLocal] = useState(rooms);
    const [withPhotoLocal, setWithPhotoLocal] = useState(withPhoto);
    const [noAgentLocal, setNoAgentLocal] = useState(noAgent);
    const config = EXTRA_FILTERS[kind] ?? {};
    const isRent = dealType === '1' || dealType === '2';

    const set = (key, val) => setLocal(p => ({ ...p, [key]: val }));
    const apply = () => {
        onApply({
            extraFilters: local,
            priceFrom: priceFromLocal,
            priceTo: priceToLocal,
            rooms: roomsLocal,
            withPhoto: withPhotoLocal,
            noAgent: noAgentLocal,
        });
        onClose();
    };
    const reset = () => {
        setLocal({});
        setPriceFromLocal('');
        setPriceToLocal('');
        setRoomsLocal('');
        setWithPhotoLocal(false);
        setNoAgentLocal(false);
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-modal popup-modal--filters" onClick={e => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>×</button>
                <h3 className="popup-title">Ещё фильтры</h3>
                <div className="extra-filters-body">

                    <div className="extra-filter-row">
                        <span className="extra-filter-row__label">Цена, ₽</span>
                        <div className="extra-filter-row__chips extra-filter-row__chips--inputs">
                            <input type="number" className="extra-input" placeholder="от" value={priceFromLocal ?? ''} onChange={e => setPriceFromLocal(e.target.value)} />
                            <span>—</span>
                            <input type="number" className="extra-input" placeholder="до" value={priceToLocal ?? ''} onChange={e => setPriceToLocal(e.target.value)} />
                        </div>
                    </div>

                    <div className="extra-filter-row">
                        <span className="extra-filter-row__label">Комнат</span>
                        <div className="extra-filter-row__chips">
                            {ROOMS_OPTIONS.filter(o => o.value !== '').map(o => (
                                <button
                                    key={o.value}
                                    className={`extra-chip${roomsLocal === o.value ? ' extra-chip--active' : ''}`}
                                    onClick={() => setRoomsLocal(roomsLocal === o.value ? '' : o.value)}
                                >{o.label}</button>
                            ))}
                        </div>
                    </div>

                    {(config.base ?? []).map(f => (
                        <div key={f.key} className="extra-filter-row">
                            <span className="extra-filter-row__label">{f.label}</span>
                            <div className="extra-filter-row__chips">
                                {f.options.map(([val, lbl]) => (
                                    <button
                                        key={val}
                                        className={`extra-chip${local[f.key] === val ? ' extra-chip--active' : ''}`}
                                        onClick={() => set(f.key, val)}
                                    >{lbl}</button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {config.floor && (
                        <div className="extra-filter-row">
                            <span className="extra-filter-row__label">Этаж</span>
                            <div className="extra-filter-row__chips extra-filter-row__chips--inputs">
                                <input type="number" className="extra-input" placeholder="от" value={local.floorFrom ?? ''} onChange={e => set('floorFrom', e.target.value)} />
                                <span>—</span>
                                <input type="number" className="extra-input" placeholder="до" value={local.floorTo ?? ''} onChange={e => set('floorTo', e.target.value)} />
                                <label className="extra-check">
                                    <input type="checkbox" checked={!!local.notFirst} onChange={e => set('notFirst', e.target.checked)} />
                                    Не первый
                                </label>
                                <label className="extra-check">
                                    <input type="checkbox" checked={!!local.notLast} onChange={e => set('notLast', e.target.checked)} />
                                    Не последний
                                </label>
                            </div>
                        </div>
                    )}

                    {(config.area ?? []).length > 0 && (
                        <div className="extra-filter-row">
                            <span className="extra-filter-row__label">Площадь, м²</span>
                            <div className="extra-filter-row__chips extra-filter-row__chips--inputs">
                                {config.area.includes('totalArea') && <>
                                    <span className="extra-area-label">Общая</span>
                                    <input type="number" className="extra-input" placeholder="от" value={local.areaFrom ?? ''} onChange={e => set('areaFrom', e.target.value)} />
                                    <input type="number" className="extra-input" placeholder="до" value={local.areaTo ?? ''} onChange={e => set('areaTo', e.target.value)} />
                                </>}
                                {config.area.includes('livingArea') && <>
                                    <span className="extra-area-label">Жилая</span>
                                    <input type="number" className="extra-input" placeholder="от" value={local.livingAreaFrom ?? ''} onChange={e => set('livingAreaFrom', e.target.value)} />
                                    <input type="number" className="extra-input" placeholder="до" value={local.livingAreaTo ?? ''} onChange={e => set('livingAreaTo', e.target.value)} />
                                </>}
                                {config.area.includes('kitchenArea') && <>
                                    <span className="extra-area-label">Кухня</span>
                                    <input type="number" className="extra-input" placeholder="от" value={local.kitchenAreaFrom ?? ''} onChange={e => set('kitchenAreaFrom', e.target.value)} />
                                    <input type="number" className="extra-input" placeholder="до" value={local.kitchenAreaTo ?? ''} onChange={e => set('kitchenAreaTo', e.target.value)} />
                                </>}
                                {config.area.includes('houseArea') && <>
                                    <span className="extra-area-label">Дом</span>
                                    <input type="number" className="extra-input" placeholder="от" value={local.houseAreaFrom ?? ''} onChange={e => set('houseAreaFrom', e.target.value)} />
                                    <input type="number" className="extra-input" placeholder="до" value={local.houseAreaTo ?? ''} onChange={e => set('houseAreaTo', e.target.value)} />
                                </>}
                                {config.area.includes('landArea') && <>
                                    <span className="extra-area-label">Участок</span>
                                    <input type="number" className="extra-input" placeholder="от" value={local.landAreaFrom ?? ''} onChange={e => set('landAreaFrom', e.target.value)} />
                                    <input type="number" className="extra-input" placeholder="до" value={local.landAreaTo ?? ''} onChange={e => set('landAreaTo', e.target.value)} />
                                </>}
                            </div>
                        </div>
                    )}

                    {(config.booleans ?? []).map(b => (
                        <div key={b.key} className="extra-filter-row">
                            <span className="extra-filter-row__label">{b.label}</span>
                            <label className="extra-check">
                                <input type="checkbox" checked={!!local[b.key]} onChange={e => set(b.key, e.target.checked)} />
                                Есть
                            </label>
                        </div>
                    ))}

                    {isRent && RENT_EXTRA.map(f => f.boolean ? (
                        <div key={f.key} className="extra-filter-row">
                            <span className="extra-filter-row__label">{f.label}</span>
                            <label className="extra-check">
                                <input type="checkbox" checked={!!local[f.key]} onChange={e => set(f.key, e.target.checked)} />
                                Да
                            </label>
                        </div>
                    ) : (
                        <div key={f.key} className="extra-filter-row">
                            <span className="extra-filter-row__label">{f.label}</span>
                            <div className="extra-filter-row__chips">
                                {f.options.map(([val, lbl]) => (
                                    <button
                                        key={val}
                                        className={`extra-chip${local[f.key] === val ? ' extra-chip--active' : ''}`}
                                        onClick={() => set(f.key, val)}
                                    >{lbl}</button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="extra-filter-row">
                        <span className="extra-filter-row__label">Тип продавца</span>
                        <div className="extra-filter-row__chips">
                            {[['', 'Любой'], ['0', 'Собственник'], ['1', 'Агент'], ['2', 'Застройщик']].map(([val, lbl]) => (
                                <button key={val} className={`extra-chip${local.sellerType === val ? ' extra-chip--active' : ''}`} onClick={() => set('sellerType', val)}>{lbl}</button>
                            ))}
                        </div>
                    </div>

                    <div className="extra-filter-row">
                        <span className="extra-filter-row__label">Прочее</span>
                        <div className="extra-filter-row__chips">
                            <label className="extra-check">
                                <input type="checkbox" checked={withPhotoLocal} onChange={e => setWithPhotoLocal(e.target.checked)} />
                                С фото
                            </label>
                            <label className="extra-check">
                                <input type="checkbox" checked={noAgentLocal} onChange={e => setNoAgentLocal(e.target.checked)} />
                                Без посредников
                            </label>
                        </div>
                    </div>

                </div>
                <div className="popup-footer">
                    <button className="popup-btn-reset" onClick={reset}>Сбросить фильтры</button>
                    <button className="popup-btn-apply" onClick={apply}>Показать объекты</button>
                </div>
            </div>
        </div>
    );
};

// --- Main page ---
const CatalogPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [sort, setSort] = useState('newest');
    const [city, setCity] = useState(null);
    const [showExtraFilters, setShowExtraFilters] = useState(false);
    const [extraFilters, setExtraFilters] = useState({});

    const dealType = searchParams.get('dealType') ?? '0';
    const kind = searchParams.get('kind') ?? '';
    const priceFrom = searchParams.get('priceFrom') ?? '';
    const priceTo = searchParams.get('priceTo') ?? '';
    const rooms = searchParams.get('rooms') ?? '';
    const withPhoto = searchParams.get('withPhoto') === 'true';
    const noAgent = searchParams.get('noAgent') === 'true';

    const setParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value); else next.delete(key);
        setSearchParams(next);
    };

    const setParams = (updates) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) next.set(key, value); else next.delete(key);
        });
        setSearchParams(next);
    };

    const fetchAds = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (dealType) params.append('dealType', dealType);
        if (kind) params.append('propertyKind', kind);
        if (priceFrom) params.append('priceFrom', priceFrom);
        if (priceTo) params.append('priceTo', priceTo);
        if (rooms) params.append('rooms', rooms);
        try {
            const res = await axios.get(`/api/ads?${params.toString()}`);
            setAds(res.data);
        } catch { setAds([]); }
        finally { setLoading(false); }
    }, [dealType, kind, priceFrom, priceTo, rooms]);

    useEffect(() => { fetchAds(); }, [fetchAds]);

    const sortedAds = [...ads].sort((a, b) => {
        if (sort === 'price_asc') return a.price - b.price;
        if (sort === 'price_desc') return b.price - a.price;
        return 0;
    });
    const displayedAds = withPhoto ? sortedAds.filter(a => a.imageUrl) : sortedAds;

    const extraCount = Object.values(extraFilters).filter(v => v !== '' && v !== false && v !== undefined).length;

    const dealInfo = DEAL_TYPE_MAP[dealType];
    const kindLabel = KIND_LABELS[kind];

    return (
        <div className="catalog-page">
            {/* Filter bar */}
            <div className="catalog-filter-bar">
                <div className="catalog-filter-bar__inner">

                    <CitySearch value={city} onChange={setCity} />

                    <select
                        className="catalog-filter__select catalog-filter__deal"
                        value={dealType}
                        onChange={e => {
                            const newDeal = e.target.value;
                            const allowedKinds = KIND_OPTIONS_BY_DEAL[newDeal] ?? [];
                            setParams({ dealType: newDeal, kind: allowedKinds.includes(kind) ? kind : '' });
                        }}
                    >
                        {DEAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>

                    <select
                        className="catalog-filter__select catalog-filter__kind"
                        value={kind}
                        onChange={e => setParam('kind', e.target.value)}
                    >
                        {getKindOptions(dealType).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>

                    <PriceDropdown
                        priceFrom={priceFrom}
                        priceTo={priceTo}
                        onChange={(f, t) => setParams({ priceFrom: f, priceTo: t })}
                    />

                    <select
                        className="catalog-filter__select catalog-filter__rooms"
                        value={rooms}
                        onChange={e => setParam('rooms', e.target.value)}
                    >
                        {ROOMS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>

                    <button
                        className={`filter-chip filter-chip--more${extraCount > 0 ? ' filter-chip--active' : ''}`}
                        onClick={() => setShowExtraFilters(true)}
                    >
                        Ещё фильтры {extraCount > 0 && `(${extraCount})`}
                    </button>
                </div>
            </div>

            <div className="catalog-content">
                <nav className="catalog-breadcrumbs">
                    <Link to="/">Главная</Link>
                    {dealInfo && <><span>›</span><Link to={dealInfo.to}>{dealInfo.label}</Link></>}
                    {kindLabel && <><span>›</span><span>{kindLabel}</span></>}
                    {city && <><span>›</span><span>{city.name}</span></>}
                </nav>

                <div className="catalog-toolbar">
                    <div className="catalog-toolbar__left">
                        <span className="catalog-toolbar__count">
                            {loading ? '...' : `${displayedAds.length} объявлений`}
                        </span>
                        <select className="catalog-toolbar__sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    <div className="catalog-toolbar__right">
                        <button className={`catalog-view-btn${view === 'grid' ? ' catalog-view-btn--active' : ''}`} onClick={() => setView('grid')} title="Сетка"><GridIcon /></button>
                        <button className={`catalog-view-btn${view === 'list' ? ' catalog-view-btn--active' : ''}`} onClick={() => setView('list')} title="Список"><ListIcon /></button>
                        <button className="catalog-view-btn" title="На карте"><MapIcon /></button>
                    </div>
                </div>

                <div className={`catalog-grid catalog-grid--${view}`}>
                    {loading ? (
                        <div className="catalog-loading">Загрузка...</div>
                    ) : displayedAds.length === 0 ? (
                        <div className="catalog-empty">Объявлений не найдено</div>
                    ) : (
                        displayedAds.map(ad => (
                            <AdCard key={ad.id} ad={ad} view={view} />
                        ))
                    )}
                </div>
            </div>

            {showExtraFilters && (
                <ExtraFiltersPopup
                    dealType={dealType}
                    kind={kind}
                    filters={extraFilters}
                    priceFrom={priceFrom}
                    priceTo={priceTo}
                    rooms={rooms}
                    withPhoto={withPhoto}
                    noAgent={noAgent}
                    onApply={(result) => {
                        setExtraFilters(result.extraFilters);
                        setParams({
                            priceFrom: result.priceFrom,
                            priceTo: result.priceTo,
                            rooms: result.rooms,
                            withPhoto: result.withPhoto ? 'true' : '',
                            noAgent: result.noAgent ? 'true' : '',
                        });
                    }}
                    onClose={() => setShowExtraFilters(false)}
                />
            )}
        </div>
    );
};

export default CatalogPage;
