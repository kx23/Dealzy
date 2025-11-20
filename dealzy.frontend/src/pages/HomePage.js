import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [ads, setAds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:5176/api/categories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch ads based on search criteria
    const fetchAds = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('query', searchQuery);
            if (selectedCategory) params.append('categoryId', selectedCategory);
            params.append('pageSize', '12');

            const response = await fetch(`http://localhost:5176/api/ads/search?${params.toString()}`);
            if (!response.ok) {
                throw new Error("Error loading data");
            }
            const data = await response.json();
            setAds(data);
        } catch (error) {
            console.error("Error fetching ads:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchAds();
    }, []);

    // Handle search button click
    const handleSearch = (e) => {
        e.preventDefault();
        fetchAds();
    };

    // Handle category change
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <div className="container">
            {/* Search Bar */}
            <div className="row my-4">
                <div className="col-12">
                    <form onSubmit={handleSearch} className="d-flex gap-2">
                        <select
                            className="form-select"
                            style={{ maxWidth: '200px' }}
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <button type="submit" className="btn btn-primary" style={{ minWidth: '100px' }}>
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="text-center my-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* Ads Grid */}
            <div className="row">
                {!loading && ads.length === 0 && (
                    <div className="col-12 text-center my-5">
                        <h4>No ads found</h4>
                        <p>Try adjusting your search criteria</p>
                    </div>
                )}

                {ads.map((ad) => (
                    <div className="col-md-4 col-lg-3" key={ad.id}>
                        <div className="card mb-4">
                            <img
                                src={ad.imageUrl || 'https://via.placeholder.com/300x200'}
                                alt={ad.title}
                                className="card-img-top"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{ad.title}</h5>
                                <p className="card-text text-truncate">{ad.description}</p>
                                <p className="card-text">
                                    <strong>Price: </strong>{ad.price} USD
                                </p>
                                {ad.category && (
                                    <span className="badge bg-secondary mb-2">
                                        {ad.category.name}
                                    </span>
                                )}
                                <div className="d-grid">
                                    <a href={`/ad/${ad.id}`} className="btn btn-primary btn-sm">
                                        View Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;