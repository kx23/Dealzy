// src/components/Breadcrumbs.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Breadcrumbs = ({ categoryId }) => {
    const [categoryPath, setCategoryPath] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!categoryId) {
            setCategoryPath([]);
            return;
        }

        const fetchCategoryPath = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/categories/${categoryId}/path`);
                setCategoryPath(response.data);
            } catch (error) {
                console.error('Error fetching category path:', error);
                setCategoryPath([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryPath();
    }, [categoryId]);

    if (loading || categoryPath.length === 0) {
        return null;
    }

    return (
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
    );
};

export default Breadcrumbs;