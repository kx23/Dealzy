import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5176';
const DEBOUNCE_DELAY = 300;
const MIN_LEN = 2;

function useSuggest(fetchFn) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const timer = useRef(null);
    const abort = useRef(null);

    useEffect(() => {
        clearTimeout(timer.current);
        abort.current?.abort();

        if (query.length < MIN_LEN) {
            setResults([]);
            setOpen(false);
            return;
        }

        timer.current = setTimeout(async () => {
            abort.current = new AbortController();
            setLoading(true);
            try {
                const data = await fetchFn(query, abort.current.signal);
                setResults(data);
                setOpen(data.length > 0);
            } catch (e) {
                if (!axios.isCancel(e)) setResults([]);
            } finally {
                setLoading(false);
            }
        }, DEBOUNCE_DELAY);

        return () => { clearTimeout(timer.current); abort.current?.abort(); };
    }, [query]);

    return { query, setQuery, results, setResults, loading, open, setOpen };
}

function getSubtitle(item) {
    if (!item.components) return null;
    const province = item.components.find(c => c.kind?.some(k => k.toLowerCase() === 'province'));
    return province?.name ?? null;
}

function SuggestInput({ placeholder, value, onChange, onSelect, results, loading, open, setOpen, disabled }) {
    const handleBlur = () => setTimeout(() => setOpen(false), 150);

    return (
        <div style={{ position: 'relative' }}>
            <input
                className="create-ad__input"
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
            />
            {loading && (
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#888' }}>
                    …
                </span>
            )}
            {open && results.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: '#fff', border: '1.5px solid #d0d8e8', borderRadius: 7,
                    marginTop: 4, maxHeight: 280, overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 1000
                }}>
                    {results.map((item, i) => (
                        <div
                            key={i}
                            onMouseDown={e => { e.preventDefault(); onSelect(item); setOpen(false); }}
                            style={{
                                padding: '10px 14px', cursor: 'pointer',
                                borderBottom: i < results.length - 1 ? '1px solid #f0f0f0' : 'none',
                                fontFamily: 'Rubik, sans-serif', fontSize: 14, color: '#1a1a1a'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                            {item.displayName}
                            {getSubtitle(item) && (
                                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                                    {getSubtitle(item)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const AddressAutocomplete = ({ onAddressSelect }) => {
    const [city, setCity] = useState(null);
    const [cityCoords, setCityCoords] = useState(null); // { lon, lat }
    const [geocoding, setGeocoding] = useState(false);

    const cityFetch = async (q, signal) => {
        const res = await axios.get(`${API_BASE_URL}/api/geocoding/search-city`, { params: { query: q }, signal });
        return res.data;
    };

    const streetFetch = async (q, signal) => {
        const res = await axios.get(`${API_BASE_URL}/api/geocoding/search-street`, { params: { query: q, city: city?.displayName }, signal });
        return res.data;
    };

    const cityInput = useSuggest(cityFetch);
    const streetInput = useSuggest(streetFetch);

    const handleCitySelect = async (item) => {
        setCity(item);
        cityInput.setQuery(item.displayName);
        cityInput.setResults([]);
        streetInput.setQuery('');
        streetInput.setResults([]);
        onAddressSelect(null);
        // geocode city to get coordinates for ll bias
        try {
            const res = await axios.get(`${API_BASE_URL}/api/geocoding/geocode-by-text`, { params: { query: item.displayName } });
            setCityCoords({ lon: res.data.longitude, lat: res.data.latitude });
        } catch {
            setCityCoords(null);
        }
    };

    const handleStreetSelect = async (item) => {
        streetInput.setQuery(item.displayName);
        streetInput.setResults([]);
        setGeocoding(true);
        try {
            const query = `${city?.displayName ?? ''} ${item.displayName}`.trim();
            const params = { query };
            if (cityCoords) { params.llLon = cityCoords.lon; params.llLat = cityCoords.lat; }
            const res = await axios.get(`${API_BASE_URL}/api/geocoding/geocode-by-text`, { params });
            const geo = res.data;
            console.log('Geocode response:', geo);
            const find = (kind) =>
                geo.components?.find(c => c.kind?.some(k => k.toLowerCase() === kind.toLowerCase()))?.name ?? null;

            onAddressSelect({
                displayName: geo.displayName,
                latitude: geo.latitude,
                longitude: geo.longitude,
                city: find('LOCALITY'),
                street: find('STREET'),
                houseNumber: find('HOUSE'),
                postalCode: null,
                country: find('COUNTRY'),
                state: find('PROVINCE'),
            });
        } catch (e) {
            console.error('Geocode error:', e);
        } finally {
            setGeocoding(false);
        }
    };

    const handleCityChange = (val) => {
        cityInput.setQuery(val);
        if (city) {
            setCity(null);
            setCityCoords(null);
            streetInput.setQuery('');
            streetInput.setResults([]);
            onAddressSelect(null);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SuggestInput
                placeholder="Город или населённый пункт"
                value={cityInput.query}
                onChange={handleCityChange}
                onSelect={handleCitySelect}
                results={cityInput.results}
                loading={cityInput.loading}
                open={cityInput.open}
                setOpen={cityInput.setOpen}
            />
            <SuggestInput
                placeholder={city ? 'Улица и дом' : 'Сначала выберите город'}
                value={streetInput.query}
                onChange={streetInput.setQuery}
                onSelect={handleStreetSelect}
                results={streetInput.results}
                loading={streetInput.loading || geocoding}
                open={streetInput.open}
                setOpen={streetInput.setOpen}
                disabled={!city}
            />
        </div>
    );
};

export default AddressAutocomplete;
