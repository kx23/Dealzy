import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavMenu.css";

const menuConfig = [
  {
    label: "Купить",
    items: [
      { label: "Квартира в новостройке", to: "/catalog?dealType=0&kind=Apartment&objectType=1" },
      { label: "Квартира во вторичке", to: "/catalog?dealType=0&kind=Apartment&objectType=2" },
      { label: "Комната", to: "/catalog?dealType=0&kind=Room" },
      { label: "Дом, дача", to: "/catalog?dealType=0&kind=House" },
      { label: "Часть дома", to: "/catalog?dealType=0&kind=HousePart" },
      { label: "Таунхаус", to: "/catalog?dealType=0&kind=Townhouse" },
      { label: "Участок", to: "/catalog?dealType=0&kind=LandPlot" },
      { label: "Гараж", to: "/catalog?dealType=0&kind=Garage" },
    ],
  },
  {
    label: "Снять",
    items: [
      { label: "Квартира", to: "/catalog?dealType=1&kind=Apartment" },
      { label: "Комната", to: "/catalog?dealType=1&kind=Room" },
      { label: "Койко-место", to: "/catalog?dealType=1&kind=Bed" },
      { label: "Дом, дача", to: "/catalog?dealType=1&kind=House" },
      { label: "Часть дома", to: "/catalog?dealType=1&kind=HousePart" },
      { label: "Таунхаус", to: "/catalog?dealType=1&kind=Townhouse" },
      { label: "Гараж", to: "/catalog?dealType=1&kind=Garage" },
    ],
  },
  {
    label: "Посуточно",
    items: [
      { label: "Квартира", to: "/catalog?dealType=2&kind=Apartment" },
      { label: "Комната", to: "/catalog?dealType=2&kind=Room" },
      { label: "Дом, дача", to: "/catalog?dealType=2&kind=House" },
      { label: "Койко-место", to: "/catalog?dealType=2&kind=Bed" },
    ],
  },
  {
    label: "Коммерческая",
    columns: [
      {
        heading: "Аренда",
        items: [
          { label: "Офис", to: "/catalog?dealType=3&kind=Office" },
          { label: "Коворкинг", to: "/catalog?dealType=3&kind=Coworking" },
          { label: "Торговая площадь", to: "/catalog?dealType=3&kind=Retail" },
          { label: "Складское помещение", to: "/catalog?dealType=3&kind=Warehouse" },
        ],
      },
      {
        heading: "Продажа",
        items: [
          { label: "Офис", to: "/catalog?dealType=4&kind=Office" },
          { label: "Торговая площадь", to: "/catalog?dealType=4&kind=Retail" },
          { label: "Складское помещение", to: "/catalog?dealType=4&kind=Warehouse" },
          { label: "Бизнес", to: "/catalog?dealType=4&kind=Business" },
        ],
      },
    ],
  },
];

const menuRoutes = ["/buy", "/rent", "/daily", "/commercial"];

const NavMenu = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const closeTimer = useRef(null);
  const location = useLocation();

  const handleMouseEnter = (i) => {
    clearTimeout(closeTimer.current);
    setOpenIndex(i);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenIndex(null), 120);
  };

  return (
    <div className="nav-menu">
      <div className="nav-menu__inner">
        {menuConfig.map((section, i) => (
          <div
            key={section.label}
            className={`nav-menu__item ${openIndex === i ? 'nav-menu__item--open' : ''} ${location.pathname === menuRoutes[i] ? 'nav-menu__item--active' : ''}`}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          >
            {i === 0 || i === 1 || i === 2 || i === 3 ? (
              <Link to={menuRoutes[i]} className="nav-menu__label">{section.label}</Link>
            ) : (
              <span className="nav-menu__label">{section.label}</span>
            )}

            {openIndex === i && (
              <div className={`nav-menu__dropdown ${section.columns ? "nav-menu__dropdown--cols" : ""}`}>
                {section.columns ? (
                  section.columns.map((col) => (
                    <div key={col.heading} className="nav-menu__col">
                      <div className="nav-menu__col-heading">{col.heading}</div>
                      <div className="nav-menu__col-divider" />
                      {col.items.map((item) => (
                        <Link key={item.to} to={item.to} className="nav-menu__link">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))
                ) : (
                  section.items.map((item) => (
                    <Link key={item.to} to={item.to} className="nav-menu__link">
                      {item.label}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavMenu;
