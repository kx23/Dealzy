import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ad, setAd] = useState(null);
    const [categoryPath, setCategoryPath] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await axios.get(`/api/ads/${id}`);
                setAd(response.data);

                // Fetch category path if categoryId exists
                if (response.data.categoryId) {
                    try {
                        const pathResponse = await axios.get(`/api/categories/${response.data.categoryId}/path`);
                        setCategoryPath(pathResponse.data);
                    } catch (pathError) {
                        console.error('Error fetching category path:', pathError);
                    }
                }
            } catch (err) {
                setError('Не удалось загрузить объявление');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAd();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-xl">Загрузка...</div>
                </div>
            </div>
        );
    }

    if (error || !ad) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || 'Объявление не найдено'}
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    ← Вернуться к списку
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline flex items-center"
            >
                ← Назад
            </button>

            {/* Breadcrumbs */}
            <nav className="mb-4 text-sm text-gray-600">
                <Link to="/" className="hover:text-blue-600">Главная</Link>
                {categoryPath && categoryPath.length > 0 && categoryPath.map((category, index) => (
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

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Details Section - Now First */}
                    <div className="p-6 order-2 md:order-1">
                        <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>

                        <div className="text-4xl font-bold text-green-600 mb-6">
                            {ad.price.toLocaleString('ru-RU')} Kč
                        </div>

                        {ad.description && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">Описание</h2>
                                <p className="text-gray-700 whitespace-pre-wrap">{ad.description}</p>
                            </div>
                        )}

                        {/* Property characteristics */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Характеристики</h2>
                            <div className="space-y-2">
                                {ad.area && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Площадь:</span>
                                        <span className="font-semibold">{ad.area} м²</span>
                                    </div>
                                )}
                                {ad.houseArea && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Площадь дома:</span>
                                        <span className="font-semibold">{ad.houseArea} м²</span>
                                    </div>
                                )}
                                {ad.landArea && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Площадь участка:</span>
                                        <span className="font-semibold">{ad.landArea} м²</span>
                                    </div>
                                )}
                                {ad.floors && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Этажей:</span>
                                        <span className="font-semibold">{ad.floors}</span>
                                    </div>
                                )}
                                {ad.rooms && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Комнат:</span>
                                        <span className="font-semibold">{ad.rooms}</span>
                                    </div>
                                )}
                                {ad.sellerType && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Тип продавца:</span>
                                        <span className="font-semibold">{ad.sellerType}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        {ad.address && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3">Адрес</h2>
                                <div className="bg-gray-50 p-4 rounded">
                                    <p className="text-gray-800">{ad.address.displayName}</p>
                                    {ad.address.city && (
                                        <p className="text-gray-600 text-sm mt-1">
                                            {ad.address.city}
                                            {ad.address.postalCode && `, ${ad.address.postalCode}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Contact button */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                            Связаться с продавцом
                        </button>
                    </div>

                    {/* Image Section - Now Second */}
                    <div className="relative order-1 md:order-2">
                        {ad.imageUrl ? (
                            <img
                                src={ad.imageUrl}
                                alt={ad.title}
                                className="w-full h-full object-cover min-h-[400px]"
                            />
                        ) : (
                            <div className="w-full h-full min-h-[400px] bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-lg">Нет фото</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDetailPage;