import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoriesMenu from "../components/CategoriesMenu";
import AddressAutocomplete from "../components/AddressAutocomplete";

// Configuration of fields by categories
const adTypeFields = {
    1: [
        { name: "title", label: "Заголовок", type: "text" },
        { name: "description", label: "Описание", type: "text" },
        { name: "imageUrl", label: "imageUrl", type: "text" },
        { name: "address", label: "Адрес", type: "address" }, // Changed type to 'address'
        { name: "price", label: "Цена", type: "number" },
        { name: "houseArea", label: "Площадь дома", type: "number" },
        { name: "landArea", label: "Площадь участка", type: "number" },
        { name: "floors", label: "Этажность", type: "number" },
        { name: "rooms", label: "Количество комнат", type: "number" }
    ],
    2: [
        { name: "title", label: "Заголовок", type: "text" },
        { name: "description", label: "Описание", type: "text" },
        { name: "imageUrl", label: "imageUrl", type: "text" },
        { name: "address", label: "Адрес", type: "address" }, // Changed type to 'address'
        { name: "price", label: "Цена", type: "number" },
        { name: "area", label: "Площадь участка", type: "number" },
    ]
};

const AddAdPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryAdType, setSelectedCategoryAdType] = useState(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        axios.get("http://localhost:5176/api/categories")
            .then(res => setCategories(res.data))
            .catch(err => console.error("Ошибка загрузки категорий", err));
    }, []);

    const handleCategorySelect = (categoryId, adType) => {
        setSelectedCategoryId(categoryId);
        setSelectedCategoryAdType(adType);
        setFormData({});
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]: type === "number" ? parseFloat(value) || 0 : value,
            categoryId: selectedCategoryId
        });
    };

    // Handler for address selection
    const handleAddressSelect = (addressDto) => {
        setFormData({
            ...formData,
            address: addressDto, // Will be null if user didn't select, or full address object
            categoryId: selectedCategoryId
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let url = "http://localhost:5176/api/ads/houseAd";

        console.log("Submitting form data:", formData);

        try {
            await axios.post(url, formData);
            alert("Объявление успешно создано!");
            setFormData({}); // Clear form
        } catch (err) {
            console.error(err);
            alert("Ошибка при создании объявления");
        }
    };

    // Render form fields dynamically
    const renderFormFields = () => {
        const fields = adTypeFields[selectedCategoryAdType];
        if (!fields) {
            return <p className="text-muted">Выберите категорию слева, чтобы заполнить форму.</p>;
        }

        return (
            <div className="d-flex flex-column">
                {fields.map((field) => (
                    <div key={field.name} className="mb-3">
                        <label className="form-label fw-semibold">{field.label}</label>

                        {/* If field is address type, use AddressAutocomplete component */}
                        {field.type === "address" ? (
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
                                style={{ maxWidth: "600px" }}
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container mt-5">
            <h2>Добавить объявление</h2>
            <div className="row">
                <div className="col-md-4">
                    <CategoriesMenu categories={categories} onSelect={handleCategorySelect} />
                </div>
                <div className="col-md-8">
                    <form onSubmit={handleSubmit}>
                        {renderFormFields()}

                        {selectedCategoryAdType !== 0 && (
                            <button className="btn btn-success mt-3 w-100">Создать объявление</button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAdPage;