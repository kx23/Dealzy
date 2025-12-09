// src/pages/CategoryPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [ads, setAds] = useState([]);
    const [categoryPath, setCategoryPath] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch category path for breadcrumbs
                const pathResponse = await axios.get(`/api/categories/${categoryId}/path`);
                setCategoryPath(pathResponse.data);

                // Fetch ads for this category (including subcategories)
                const adsResponse = await axios.get(`/api/ads/search?categoryId=${categoryId}&includeSubcategories=true`);
                setAds(adsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchData();
        }
    }, [categoryId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    const currentCategory = categoryPath[categoryPath.length - 1];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <nav className="mb-4 text-sm text-gray-600">
                <Link to="/" className="hover:text-blue-600">Главная</Link>
                {categoryPath.map((category, index) => (
                    <span key={category.id}>
                        <span className="mx-2">→</span>
                        {index === categoryPath.length - 1 ? (
                            <span className="text-gray-900 font-medium">{category.name}</span>
                        ) : (
                            <Link to={`/category/${category.id}`} className="hover:text-blue-600">
                                {category.name}
                            </Link>
                        )}
                    </span>
                ))}
            </nav>

            {/* Category Title */}
            <h1 className="text-3xl font-bold mb-6">{currentCategory?.name}</h1>

            {/* Ads Count */}
            <p className="text-gray-600 mb-4">Найдено объявлений: {ads.length}</p>

            {/* Ads Grid */}
            <div className="row">
                {ads.length === 0 && (
                    <div className="col-12 text-center my-5">
                        <h4>Объявлений не найдено</h4>
                        <p>В этой категории пока нет объявлений</p>
                    </div>
                )}

                {ads.map((ad) => (
                    <div className="col-md-4 col-lg-3 mb-4" key={ad.id}>
                        <div className="card h-100">
                            <img
                                src={ad.imageUrl || 'https://via.placeholder.com/300x200'}
                                alt={ad.title}
                                className="card-img-top"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{ad.title}</h5>
                                <p className="card-text text-truncate">{ad.description}</p>
                                <p className="card-text">
                                    <strong>Цена: </strong>{ad.price.toLocaleString('ru-RU')} Kč
                                </p>
                                {ad.categoryName && (
                                    <span className="badge bg-secondary mb-2">
                                        {ad.categoryName}
                                    </span>
                                )}
                                <div className="mt-auto">
                                    <Link to={`/ad/${ad.id}`} className="btn btn-primary btn-sm w-100">
                                        Подробнее
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;