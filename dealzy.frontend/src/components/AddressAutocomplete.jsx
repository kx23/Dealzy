import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AddressAutocomplete = ({ onAddressSelect, value }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const debounceTimer = useRef(null);
    const abortController = useRef(null);

    const MIN_QUERY_LENGTH = 3;
    const DEBOUNCE_DELAY = 300;
    const API_BASE_URL = 'http://localhost:5176';

    useEffect(() => {
        setError(null);

        // If query is too short, clear results
        if (query.length < MIN_QUERY_LENGTH) {
            setResults([]);
            setShowDropdown(false);
            // If user cleared input, notify parent that address is null
            if (query.length === 0 && selectedAddress) {
                setSelectedAddress(null);
                onAddressSelect(null);
            }
            return;
        }

        // Cancel previous request
        if (abortController.current) {
            abortController.current.abort();
        }

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set new timer for debounced search
        debounceTimer.current = setTimeout(() => {
            searchAddress(query);
        }, DEBOUNCE_DELAY);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            if (abortController.current) {
                abortController.current.abort();
            }
        };
    }, [query]);

    const searchAddress = async (searchQuery) => {
        setIsLoading(true);
        setError(null);

        abortController.current = new AbortController();

        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/geocoding/search`,
                {
                    params: { query: searchQuery },
                    signal: abortController.current.signal
                }
            );

            setResults(response.data);
            setShowDropdown(response.data.length > 0);

            if (response.data.length === 0) {
                setError('Адрес не найден');
            }
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Request canceled');
            } else {
                console.error('Error searching address:', err);
                setError('Ошибка при поиске адреса');
            }
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (address) => {
        // Create address object matching backend DTO structure
        const addressDto = {
            displayName: address.displayName,
            latitude: address.latitude,
            longitude: address.longitude,
            city: address.address?.city || null,
            street: address.address?.street || address.address?.road || null,
            houseNumber: address.address?.houseNumber || null,
            postalCode: address.address?.postcode || null,
            country: address.address?.country || null,
            state: address.address?.state || null
        };

        setQuery(address.displayName);
        setSelectedAddress(addressDto);
        setShowDropdown(false);
        onAddressSelect(addressDto);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0 && value.length < MIN_QUERY_LENGTH) {
            setError(`Введите минимум ${MIN_QUERY_LENGTH} символа`);
        } else {
            setError(null);
        }
    };

    const handleBlur = () => {
        // Delay to allow click on dropdown item
        setTimeout(() => {
            setShowDropdown(false);
        }, 200);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => results.length > 0 && setShowDropdown(true)}
                    onBlur={handleBlur}
                    placeholder="Начните вводить адрес..."
                    className={`form-control shadow-sm ${error ? 'is-invalid' : ''} ${selectedAddress ? 'is-valid' : ''}`}
                    autoComplete="off"
                    style={{ maxWidth: '600px' }}
                />

                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}>
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                {!isLoading && selectedAddress && (
                    <div style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#198754',
                        fontWeight: 'bold'
                    }}>
                        ✓
                    </div>
                )}
            </div>

            {error && query.length >= MIN_QUERY_LENGTH && (
                <div className="text-danger small mt-1">{error}</div>
            )}

            {query.length > 0 && query.length < MIN_QUERY_LENGTH && (
                <div className="text-muted small mt-1">
                    Введите минимум {MIN_QUERY_LENGTH} символа
                </div>
            )}

            {showDropdown && results.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxWidth: '600px',
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    marginTop: '4px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000
                }}>
                    {results.map((address, index) => (
                        <div
                            key={index}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelect(address);
                            }}
                            style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderBottom: index < results.length - 1 ? '1px solid #f0f0f0' : 'none',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <div style={{ fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                                {address.displayName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressAutocomplete;