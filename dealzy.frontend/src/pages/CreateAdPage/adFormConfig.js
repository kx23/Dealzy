export const DEAL_TYPES = {
  RENT: 'Rent',
  DAILY: 'RentDaily',
  BUY: 'Buy',
  COMMERCIAL_RENT: 'CommercialRent',
  COMMERCIAL_BUY: 'CommercialBuy',
};

export const DEAL_BUTTONS = [
  { key: 'rent',  label: 'Аренда'    },
  { key: 'daily', label: 'Посуточно' },
  { key: 'buy',   label: 'Продажа'   },
];

export const CATEGORY_GROUPS = {
  rent: [
    {
      heading: 'Жилая недвижимость',
      items: [
        { key: 'apartment', label: 'Квартира',            propertyKind: 'apartment', dealType: DEAL_TYPES.RENT },
        { key: 'room',      label: 'Комната',             propertyKind: 'room',      dealType: DEAL_TYPES.RENT },
        { key: 'house',     label: 'Дом, дача',           propertyKind: 'house',     dealType: DEAL_TYPES.RENT },
        { key: 'garage',    label: 'Гараж',               propertyKind: 'garage',    dealType: DEAL_TYPES.RENT },
      ],
    },
    {
      heading: 'Коммерческая',
      items: [
        { key: 'office',    label: 'Офис',                propertyKind: 'office',    dealType: DEAL_TYPES.COMMERCIAL_RENT },
        { key: 'coworking', label: 'Коворкинг',           propertyKind: 'coworking', dealType: DEAL_TYPES.COMMERCIAL_RENT },
        { key: 'retail',    label: 'Торговая площадь',    propertyKind: 'retail',    dealType: DEAL_TYPES.COMMERCIAL_RENT },
        { key: 'warehouse', label: 'Складское помещение', propertyKind: 'warehouse', dealType: DEAL_TYPES.COMMERCIAL_RENT },
      ],
    },
  ],
  daily: [
    {
      heading: 'Жилая недвижимость',
      items: [
        { key: 'apartment', label: 'Квартира',  propertyKind: 'apartment', dealType: DEAL_TYPES.DAILY },
        { key: 'room',      label: 'Комната',   propertyKind: 'room',      dealType: DEAL_TYPES.DAILY },
        { key: 'house',     label: 'Дом, дача', propertyKind: 'house',     dealType: DEAL_TYPES.DAILY },
      ],
    },
  ],
  buy: [
    {
      heading: 'Жилая недвижимость',
      items: [
        { key: 'apartment',        label: 'Квартира в новостройке', propertyKind: 'apartment', dealType: DEAL_TYPES.BUY },
        { key: 'apartment-resale', label: 'Квартира во вторичке',   propertyKind: 'apartment', dealType: DEAL_TYPES.BUY },
        { key: 'room',             label: 'Комната',                propertyKind: 'room',      dealType: DEAL_TYPES.BUY },
        { key: 'house',            label: 'Дом, дача',              propertyKind: 'house',     dealType: DEAL_TYPES.BUY },
        { key: 'landPlot',         label: 'Участок',                propertyKind: 'landPlot',  dealType: DEAL_TYPES.BUY },
        { key: 'garage',           label: 'Гараж',                  propertyKind: 'garage',    dealType: DEAL_TYPES.BUY },
      ],
    },
    {
      heading: 'Коммерческая',
      items: [
        { key: 'office',    label: 'Офис',                propertyKind: 'office',    dealType: DEAL_TYPES.COMMERCIAL_BUY },
        { key: 'retail',    label: 'Торговая площадь',    propertyKind: 'retail',    dealType: DEAL_TYPES.COMMERCIAL_BUY },
        { key: 'warehouse', label: 'Складское помещение', propertyKind: 'warehouse', dealType: DEAL_TYPES.COMMERCIAL_BUY },
      ],
    },
  ],
};

// ── Shared base ──────────────────────────────────────────────────────────────

const BASE_FIELDS = [
  { name: 'title',       label: 'Заголовок',     type: 'text',     required: true },
  { name: 'description', label: 'Описание',       type: 'textarea' },
  { name: 'price',       label: 'Цена (₽)',       type: 'number',   required: true },
  { name: 'area',        label: 'Площадь (м²)',   type: 'number',   required: true },
  { name: 'address',     label: 'Адрес',          type: 'address'  },
  { name: 'imageUrl',    label: 'Ссылка на фото', type: 'text'     },
  { name: 'sellerType',  label: 'Тип продавца',   type: 'select',
    options: [
      { value: 'Owner',     label: 'Собственник' },
      { value: 'Agent',     label: 'Агент'        },
      { value: 'Developer', label: 'Застройщик'   },
    ]
  },
];

const RENT_FIELDS = [
  { name: 'rentPeriod', label: 'Срок аренды', type: 'select',
    options: [
      { value: 'FromYear',      label: 'От года'             },
      { value: 'SeveralMonths', label: 'Несколько месяцев'   },
    ]
  },
  { name: 'noDeposit', label: 'Без залога', type: 'boolean' },
];

const DAILY_FIELDS = [
  { name: 'noDeposit', label: 'Без залога', type: 'boolean' },
];

// ── Property-specific field sets ─────────────────────────────────────────────

const APARTMENT_SPECIFIC = [
  { name: 'rooms',            label: 'Комнат',          type: 'number', required: true },
  { name: 'apartmentFloor',   label: 'Этаж',            type: 'number', required: true },
  { name: 'buildingFloors',   label: 'Этажей в доме',   type: 'number', required: true },
  { name: 'kitchenArea',      label: 'Площадь кухни',   type: 'number' },
  { name: 'livingArea',       label: 'Жилая площадь',   type: 'number' },
  { name: 'ceilingHeight',    label: 'Высота потолков',  type: 'number' },
  { name: 'constructionYear', label: 'Год постройки',    type: 'number' },
  { name: 'renovationType', label: 'Ремонт', type: 'select',
    options: [
      { value: 'None',     label: 'Без ремонта'   },
      { value: 'Cosmetic', label: 'Косметический'  },
      { value: 'Euro',     label: 'Евроремонт'     },
      { value: 'Design',   label: 'Дизайнерский'   },
    ]
  },
  { name: 'buildingType', label: 'Тип дома', type: 'select',
    options: [
      { value: 'Panel',    label: 'Панельный'  },
      { value: 'Brick',    label: 'Кирпичный'  },
      { value: 'Monolith', label: 'Монолитный' },
      { value: 'Block',    label: 'Блочный'    },
    ]
  },
  { name: 'isApartments', label: 'Апартаменты', type: 'boolean' },
];

const ROOM_SPECIFIC = [
  { name: 'apartmentFloor',        label: 'Этаж',               type: 'number', required: true },
  { name: 'buildingFloors',        label: 'Этажей в доме',      type: 'number', required: true },
  { name: 'totalRoomsInApartment', label: 'Всего комнат в кв.', type: 'number' },
  { name: 'roomsForSale',          label: 'Комнат в продаже',   type: 'number' },
  { name: 'ceilingHeight',         label: 'Высота потолков',    type: 'number' },
  { name: 'constructionYear',      label: 'Год постройки',      type: 'number' },
  { name: 'isMortgagePossible',    label: 'Возможна ипотека',   type: 'boolean' },
  { name: 'isDemolitionBuilding',  label: 'Под снос',           type: 'boolean' },
];

const HOUSE_SPECIFIC = [
  { name: 'houseArea',        label: 'Площадь дома (м²)',      type: 'number', required: true },
  { name: 'landArea',         label: 'Площадь участка (сот.)', type: 'number', required: true },
  { name: 'floors',           label: 'Этажей',                 type: 'number', required: true },
  { name: 'rooms',            label: 'Комнат',                 type: 'number', required: true },
  { name: 'bedrooms',         label: 'Спален',                 type: 'number' },
  { name: 'constructionYear', label: 'Год постройки',          type: 'number' },
  { name: 'material', label: 'Материал стен', type: 'select',
    options: [
      { value: 'Brick', label: 'Кирпич'    },
      { value: 'Wood',  label: 'Дерево'    },
      { value: 'Foam',  label: 'Пеноблок'  },
      { value: 'Frame', label: 'Каркасный' },
    ]
  },
  { name: 'hasBanya',    label: 'Баня/сауна', type: 'boolean' },
  { name: 'hasGarage',   label: 'Гараж',      type: 'boolean' },
  { name: 'hasPool',     label: 'Бассейн',    type: 'boolean' },
  { name: 'hasSecurity', label: 'Охрана',     type: 'boolean' },
];

const GARAGE_SPECIFIC = [
  { name: 'garageType', label: 'Тип', type: 'select',
    options: [
      { value: 'Garage',       label: 'Гараж'       },
      { value: 'ParkingSpace', label: 'Машино-место' },
      { value: 'Box',          label: 'Бокс'         },
    ]
  },
  { name: 'ownershipStatus', label: 'Право собственности', type: 'select',
    options: [
      { value: 'Owned', label: 'Собственность' },
      { value: 'Coop',  label: 'Кооператив'    },
    ]
  },
];

const LAND_SPECIFIC = [
  { name: 'landStatus', label: 'Категория земли', type: 'select',
    options: [
      { value: 'IndividualHousingConstruction', label: 'ИЖС'                  },
      { value: 'Gardening',                     label: 'Садоводство'           },
      { value: 'DNP',                           label: 'ДНП'                  },
      { value: 'PersonalSubsidiaryFarm',        label: 'ЛПХ'                  },
      { value: 'FarmingEnterprise',             label: 'Фермерское хозяйство' },
      { value: 'IndustrialLand',                label: 'Промышленность'       },
    ]
  },
];

const OFFICE_SPECIFIC = [
  { name: 'floorMin',         label: 'Этаж от',         type: 'number' },
  { name: 'floorMax',         label: 'Этаж до',         type: 'number' },
  { name: 'buildingFloors',   label: 'Этажей в здании', type: 'number' },
  { name: 'constructionYear', label: 'Год постройки',   type: 'number' },
  { name: 'class', label: 'Класс офиса', type: 'select',
    options: [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
    ]
  },
  { name: 'condition', label: 'Состояние', type: 'select',
    options: [
      { value: 'OpenSpace', label: 'Открытая планировка' },
      { value: 'Cabinet',   label: 'Кабинетная'          },
      { value: 'Combined',  label: 'Комбинированная'     },
    ]
  },
  { name: 'hasParking',    label: 'Парковка', type: 'boolean' },
  { name: 'furnitureType', label: 'Мебель',   type: 'select',
    options: [
      { value: 'None',    label: 'Без мебели' },
      { value: 'Partial', label: 'Частично'   },
      { value: 'Full',    label: 'Полностью'  },
    ]
  },
];

const COWORKING_SPECIFIC = [
  { name: 'floorMin',       label: 'Этаж от',         type: 'number' },
  { name: 'buildingFloors', label: 'Этажей в здании', type: 'number' },
  { name: 'access', label: 'Режим доступа', type: 'select',
    options: [
      { value: 'Allday',   label: 'Круглосуточно' },
      { value: 'Business', label: 'Бизнес-часы'   },
    ]
  },
  { name: 'hasParking', label: 'Парковка', type: 'boolean' },
];

const RETAIL_SPECIFIC = [
  { name: 'floorMin',         label: 'Этаж от',         type: 'number' },
  { name: 'floorMax',         label: 'Этаж до',         type: 'number' },
  { name: 'buildingFloors',   label: 'Этажей в здании', type: 'number' },
  { name: 'constructionYear', label: 'Год постройки',   type: 'number' },
  { name: 'spaceType', label: 'Тип помещения', type: 'select',
    options: [
      { value: 'StreetRetail',   label: 'Стрит-ритейл'  },
      { value: 'ShoppingCenter', label: 'Торговый центр' },
      { value: 'Market',         label: 'Рынок'          },
    ]
  },
  { name: 'entranceType', label: 'Вход', type: 'select',
    options: [
      { value: 'Separate', label: 'Отдельный' },
      { value: 'Common',   label: 'Общий'      },
    ]
  },
  { name: 'isFirstLine', label: 'Первая линия', type: 'boolean' },
  { name: 'hasParking',  label: 'Парковка',     type: 'boolean' },
];

const WAREHOUSE_SPECIFIC = [
  { name: 'buildingFloors',   label: 'Этажей в здании', type: 'number' },
  { name: 'constructionYear', label: 'Год постройки',   type: 'number' },
  { name: 'class', label: 'Класс склада', type: 'select',
    options: [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
    ]
  },
  { name: 'condition', label: 'Состояние', type: 'select',
    options: [
      { value: 'Good',         label: 'Хорошее'            },
      { value: 'Satisfactory', label: 'Удовлетворительное' },
    ]
  },
  { name: 'heatingType', label: 'Отопление', type: 'select',
    options: [
      { value: 'Central', label: 'Центральное' },
      { value: 'None',    label: 'Отсутствует' },
    ]
  },
  { name: 'hasParking', label: 'Парковка', type: 'boolean' },
];

// ── Configs by deal type ─────────────────────────────────────────────────────

export const FIELDS_BY_KIND_RENT = {
  apartment: [...BASE_FIELDS, ...APARTMENT_SPECIFIC, ...RENT_FIELDS],
  room:      [...BASE_FIELDS, ...ROOM_SPECIFIC, ...RENT_FIELDS],
  house:     [...BASE_FIELDS, ...HOUSE_SPECIFIC, ...RENT_FIELDS],
  garage:    [...BASE_FIELDS, ...GARAGE_SPECIFIC, ...RENT_FIELDS],
  office:    [...BASE_FIELDS, ...OFFICE_SPECIFIC, ...RENT_FIELDS],
  coworking: [...BASE_FIELDS, ...COWORKING_SPECIFIC, ...RENT_FIELDS],
  retail:    [...BASE_FIELDS, ...RETAIL_SPECIFIC, ...RENT_FIELDS],
  warehouse: [...BASE_FIELDS, ...WAREHOUSE_SPECIFIC, ...RENT_FIELDS],
};

export const FIELDS_BY_KIND_DAILY = {
  apartment: [...BASE_FIELDS, ...APARTMENT_SPECIFIC, ...DAILY_FIELDS],
  room:      [...BASE_FIELDS, ...ROOM_SPECIFIC, ...DAILY_FIELDS],
  house:     [...BASE_FIELDS, ...HOUSE_SPECIFIC, ...DAILY_FIELDS],
};

export const FIELDS_BY_KIND_BUY = {
  apartment: [...BASE_FIELDS, ...APARTMENT_SPECIFIC, { name: 'isShareSale', label: 'Продажа доли', type: 'boolean' }],
  room:      [...BASE_FIELDS, ...ROOM_SPECIFIC],
  house:     [...BASE_FIELDS, ...HOUSE_SPECIFIC],
  garage:    [...BASE_FIELDS, ...GARAGE_SPECIFIC],
  landPlot:  [...BASE_FIELDS, ...LAND_SPECIFIC],
  office:    [...BASE_FIELDS, ...OFFICE_SPECIFIC],
  retail:    [...BASE_FIELDS, ...RETAIL_SPECIFIC],
  warehouse: [...BASE_FIELDS, ...WAREHOUSE_SPECIFIC],
};
