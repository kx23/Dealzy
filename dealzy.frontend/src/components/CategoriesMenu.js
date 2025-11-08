import React, { useState } from "react";

// Рекурсивный компонент для подкатегорий
const RecursiveCategories = ({ categories, onSelect }) => {
    return (
        <ul className="list-group">
            {categories.map(cat => (
                <li
                    key={cat.id}
                    className="list-group-item"
                    onClick={() => onSelect(cat.name)}
                    style={{ cursor: "pointer" }}
                >
                    {cat.name}
                    {cat.children?.length > 0 && (
                        <RecursiveCategories categories={cat.children} onSelect={onSelect} />
                    )}
                </li>
            ))}
        </ul>
    );
};

const CategoriesMenu = ({ categories, onSelect }) => {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const rootCategories = categories.filter(c => !c.parentId);

    return (
        <div className="d-flex">
            {/* Слева — главные категории */}
            <div className="me-4" style={{ width: "200px" }}>
                <ul className="list-group">
                    {rootCategories.map(cat => (
                        <li
                            key={cat.id}
                            className="list-group-item"
                            onMouseEnter={() => setHoveredCategory(cat)}
                            style={{ cursor: "pointer" }}
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Справа — подкатегории выбранной категории */}
            <div style={{ flex: 1 }}>
                {hoveredCategory && hoveredCategory.children?.length > 0 ? (
                    <RecursiveCategories
                        categories={hoveredCategory.children}
                        onSelect={onSelect}
                    />
                ) : (
                    <p className="text-muted">Наведи на категорию слева, чтобы увидеть подкатегории</p>
                )}
            </div>
        </div>
    );
};

export default CategoriesMenu;
