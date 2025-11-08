import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoriesMenu from "../components/CategoriesMenu"; // <-- импортируем меню категорий

const AddAdPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [formData, setFormData] = useState({});

    useEffect(() => {
        axios.get("http://localhost:5176/api/categories")
            .then(res => setCategories(res.data))
            .catch(err => console.error("Ошибка загрузки категорий", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
        setFormData({}); // очищаем форму при смене категории
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = "http://localhost:5176/api/ads";

        switch (selectedCategory) {
            case "Собственный дом":
                url = "http://localhost:5176/api/realestate/house"; break;
            case "Квартира":
                url = "http://localhost:5176/api/realestate/apartment"; break;
            case "Коммерческая недвижимость":
                url = "http://localhost:5176/api/realestate/commercial"; break;
            case "Земельный участок":
                url = "http://localhost:5176/api/realestate/land"; break;
        }

        try {
            await axios.post(url, formData);
            alert("Объявление успешно создано!");
        } catch (err) {
            console.error(err);
            alert("Ошибка при создании объявления");
        }
    };

    const renderForm = () => {
        switch (selectedCategory) {
            case "Собственный дом": return (
                <>
                    <input name="title" placeholder="Заголовок" onChange={handleChange} />
                    <input name="address" placeholder="Адрес" onChange={handleChange} />
                    <input name="price" type="number" placeholder="Цена" onChange={handleChange} />
                    <input name="area" placeholder="Общая площадь" onChange={handleChange} />
                    <input name="houseArea" placeholder="Площадь дома" onChange={handleChange} />
                    <input name="landArea" placeholder="Площадь участка" onChange={handleChange} />
                    <input name="floors" placeholder="Этажность" onChange={handleChange} />
                    <input name="rooms" placeholder="Комнат" onChange={handleChange} />
                </>
            );
            case "Квартира": return (
                <>
                    <input name="title" placeholder="Заголовок" onChange={handleChange} />
                    <input name="address" placeholder="Адрес" onChange={handleChange} />
                    <input name="price" type="number" placeholder="Цена" onChange={handleChange} />
                    <input name="area" placeholder="Общая площадь" onChange={handleChange} />
                    <input name="buildingFloors" placeholder="Этажность здания" onChange={handleChange} />
                    <input name="apartmentFloor" placeholder="Этаж квартиры" onChange={handleChange} />
                    <input name="rooms" placeholder="Комнат" onChange={handleChange} />
                </>
            );
            case "Коммерческая недвижимость": return (
                <>
                    <input name="title" placeholder="Заголовок" onChange={handleChange} />
                    <input name="address" placeholder="Адрес" onChange={handleChange} />
                    <input name="price" type="number" placeholder="Цена" onChange={handleChange} />
                    <input name="purpose" placeholder="Назначение" onChange={handleChange} />
                    <input name="area" placeholder="Площадь" onChange={handleChange} />
                    <input name="floors" placeholder="Этажность" onChange={handleChange} />
                </>
            );
            case "Земельный участок": return (
                <>
                    <input name="title" placeholder="Заголовок" onChange={handleChange} />
                    <input name="address" placeholder="Адрес" onChange={handleChange} />
                    <input name="price" type="number" placeholder="Цена" onChange={handleChange} />
                    <input name="landArea" placeholder="Площадь участка" onChange={handleChange} />
                    <input name="purpose" placeholder="Назначение участка" onChange={handleChange} />
                </>
            );
            default: return <p className="text-muted">Выберите категорию слева, чтобы заполнить форму.</p>;
        }
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
                        {renderForm()}
                        {selectedCategory && <button className="btn btn-success mt-3 w-100">Создать объявление</button>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAdPage;
