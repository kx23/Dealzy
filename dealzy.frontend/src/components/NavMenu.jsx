import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavMenu.css";

const menuConfig = [
  {
    label: "Купить",
    items: [
      { label: "Квартира в новостройке", to: "/catalog?type=buy&kind=new-apartment" },
      { label: "Квартира во вторичке", to: "/catalog?type=buy&kind=resale-apartment" },
      { label: "Комната", to: "/catalog?type=buy&kind=room" },
      { label: "Дом, дача", to: "/catalog?type=buy&kind=house" },
      { label: "Часть дома", to: "/catalog?type=buy&kind=house-part" },
      { label: "Таунхаус", to: "/catalog?type=buy&kind=townhouse" },
      { label: "Участок", to: "/catalog?type=buy&kind=land" },
      { label: "Гараж", to: "/catalog?type=buy&kind=garage" },
    ],
  },
  {
    label: "Снять",
    items: [
      { label: "Квартира", to: "/catalog?type=rent&kind=apartment" },
      { label: "Комната", to: "/catalog?type=rent&kind=room" },
      { label: "Койко-место", to: "/catalog?type=rent&kind=bed" },
      { label: "Дом, дача", to: "/catalog?type=rent&kind=house" },
      { label: "Часть дома", to: "/catalog?type=rent&kind=house-part" },
      { label: "Таунхаус", to: "/catalog?type=rent&kind=townhouse" },
      { label: "Гараж", to: "/catalog?type=rent&kind=garage" },
    ],
  },
  {
    label: "Посуточно",
    items: [
      { label: "Квартира", to: "/catalog?type=daily&kind=apartment" },
      { label: "Комната", to: "/catalog?type=daily&kind=room" },
      { label: "Дом, дача", to: "/catalog?type=daily&kind=house" },
      { label: "Койко-место", to: "/catalog?type=daily&kind=bed" },
    ],
  },
  {
    label: "Коммерческая",
    columns: [
      {
        heading: "Аренда",
        items: [
          { label: "Офис", to: "/catalog?type=commercial-rent&kind=office" },
          { label: "Коворкинг", to: "/catalog?type=commercial-rent&kind=coworking" },
          { label: "Торговая площадь", to: "/catalog?type=commercial-rent&kind=retail" },
          { label: "Складское помещение", to: "/catalog?type=commercial-rent&kind=warehouse" },
        ],
      },
      {
        heading: "Продажа",
        items: [
          { label: "Офис", to: "/catalog?type=commercial-buy&kind=office" },
          { label: "Торговая площадь", to: "/catalog?type=commercial-buy&kind=retail" },
          { label: "Складское помещение", to: "/catalog?type=commercial-buy&kind=warehouse" },
          { label: "Бизнес", to: "/catalog?type=commercial-buy&kind=business" },
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
