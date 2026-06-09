import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoriesMenu from '../components/CategoriesMenu';
import AddressAutocomplete from '../components/AddressAutocomplete';

const adFieldsByCategory = {
    '33333333-3333-3333-3333-333333333333': [
        { name: 'title', label: 'Заголовок', type: 'text' },
        { name: 'description', label: 'Описание', type: 'text' },
        { name: 'imageUrl', label: 'Ссылка на фото', type: 'text' },
        { name: 'address', label: 'Адрес', type: 'address' },
        { name: 'price', label: 'Цена', type: 'number' },
        { name: 'houseArea', label: 'Площадь дома', type: 'number' },
        { name: 'landArea', label: 'Площадь участка', type: 'number' },
        { name: 'floors', label: 'Этажность', type: 'number' },
        { name: 'rooms', label: 'Количество комнат', type: 'number' },
    ],
    '44444444-4444-4444-4444-444444444444': [
        { name: 'title', label: 'Заголовок', type: 'text' },
        { name: 'description', label: 'Описание', type: 'text' },
        { name: 'imageUrl', label: 'Ссылка на фото', type: 'text' },
        { name: 'address', label: 'Адрес', type: 'address' },
        { name: 'price', label: 'Цена', type: 'number' },
        { name: 'area', label: 'Площадь', type: 'number' },
    ],
};

const AddAdPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        axios.get('http://localhost:5176/api/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleCategorySelect = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setFormData({});
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
            categoryId: selectedCategoryId,
        }));
    };

    const handleAddressSelect = (addressDto) => {
        setFormData(prev => ({
            ...prev,
            address: addressDto,
            categoryId: selectedCategoryId,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5176/api/ads/houseAd', formData);
            alert('Объявление успешно создано!');
            setFormData({});
        } catch (err) {
            console.error(err);
            alert('Ошибка при создании объявления');
        }
    };

    const fields = selectedCategoryId ? adFieldsByCategory[selectedCategoryId] : null;

    return (
        <div className="container mt-5">
            <h2>Добавить объявление</h2>
            <div className="row">
                <div className="col-md-4">
                    <CategoriesMenu categories={categories} onSelect={handleCategorySelect} />
                </div>
                <div className="col-md-8">
                    <form onSubmit={handleSubmit}>
                        {!fields ? (
                            <p className="text-muted">Выберите категорию слева, чтобы заполнить форму.</p>
                        ) : (
                            <div className="d-flex flex-column">
                                {fields.map(field => (
                                    <div key={field.name} className="mb-3">
                                        <label className="form-label fw-semibold">{field.label}</label>
                                        {field.type === 'address' ? (
                                            <AddressAutocomplete
                                                onAddressSelect={handleAddressSelect}
                                                value={formData.address}
                                            />
                                        ) : (
                                            <input
                                                name={field.name}
                                                type={field.type}
                                                className="form-control shadow-sm"
                                                onChange={handleChange}
                                                value={formData[field.name] || ''}
                                                style={{ maxWidth: '600px' }}
                                            />
                                        )}
                                    </div>
                                ))}
                                <button className="btn btn-success mt-3 w-100">Создать объявление</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAdPage;
