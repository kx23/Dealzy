import React, { useState } from 'react';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import { DEAL_BUTTONS, CATEGORY_GROUPS, FIELDS_BY_KIND } from './adFormConfig';
import './CreateAdPage.css';

const API_BASE = 'http://localhost:5176';

const CreateAdPage = () => {
  const [dealKey, setDealKey]       = useState(null); // 'rent' | 'daily' | 'buy'
  const [selected, setSelected]     = useState(null); // { propertyKind, dealType, label }
  const [formData, setFormData]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]         = useState(null); // { ok, message }

  const fields = selected ? (FIELDS_BY_KIND[selected.propertyKind] ?? []) : [];

  const handleDealClick = (key) => {
    if (dealKey === key) return;
    setDealKey(key);
    setSelected(null);
    setFormData({});
    setResult(null);
  };

  const handleCategoryClick = (item) => {
    setSelected(item);
    setFormData({});
    setResult(null);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const payload = {
        ...formData,
        propertyKind: selected.propertyKind,
        dealType: selected.dealType,
      };
      const res = await fetch(`${API_BASE}/api/ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setResult({ ok: true, message: 'Объявление создано!' });
        setFormData({});
      } else {
        const text = await res.text();
        setResult({ ok: false, message: `Ошибка: ${text}` });
      }
    } catch (e) {
      setResult({ ok: false, message: 'Не удалось подключиться к серверу.' });
    } finally {
      setSubmitting(false);
    }
  };

  const groups = dealKey ? CATEGORY_GROUPS[dealKey] : null;

  return (
    <div className="create-ad">
      <div className="create-ad__container">
        <h1 className="create-ad__title">Создать объявление</h1>

        {/* Step 1 — deal type */}
        <div className="create-ad__deal-row">
          {DEAL_BUTTONS.map(btn => (
            <button
              key={btn.key}
              className={`create-ad__deal-btn ${dealKey === btn.key ? 'create-ad__deal-btn--active' : ''}`}
              onClick={() => handleDealClick(btn.key)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Step 2 — category panel */}
        {groups && (
          <div className="create-ad__categories">
            {groups.map(group => (
              <div key={group.heading} className="create-ad__cat-group">
                <div className="create-ad__cat-heading">{group.heading}</div>
                <div className="create-ad__cat-divider" />
                <div className="create-ad__cat-items">
                  {group.items.map(item => (
                    <button
                      key={item.key}
                      className={`create-ad__cat-btn ${selected?.key === item.key ? 'create-ad__cat-btn--active' : ''}`}
                      onClick={() => handleCategoryClick(item)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3 — form */}
        {selected && fields.length > 0 && (
          <div className="create-ad__form">
            <h2 className="create-ad__form-title">{selected.label}</h2>

            {fields.map(field => (
              <FieldRow
                key={field.name}
                field={field}
                value={formData[field.name] ?? ''}
                onChange={handleChange}
              />
            ))}

            {result && (
              <div className={`create-ad__result ${result.ok ? 'create-ad__result--ok' : 'create-ad__result--err'}`}>
                {result.message}
              </div>
            )}

            <button
              className="create-ad__submit"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Отправка...' : 'Опубликовать'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const FieldRow = ({ field, value, onChange }) => {
  const { name, label, type, options, required } = field;

  return (
    <div className="create-ad__field">
      <label className="create-ad__label">
        {label}{required && <span className="create-ad__required"> *</span>}
      </label>

      {type === 'text' && (
        <input
          className="create-ad__input"
          type="text"
          value={value}
          onChange={e => onChange(name, e.target.value)}
        />
      )}

      {type === 'number' && (
        <input
          className="create-ad__input create-ad__input--short"
          type="number"
          value={value}
          onChange={e => onChange(name, e.target.value === '' ? '' : Number(e.target.value))}
        />
      )}

      {type === 'textarea' && (
        <textarea
          className="create-ad__input create-ad__input--textarea"
          value={value}
          rows={4}
          onChange={e => onChange(name, e.target.value)}
        />
      )}

      {type === 'select' && (
        <select
          className="create-ad__input create-ad__input--select"
          value={value}
          onChange={e => onChange(name, e.target.value)}
        >
          <option value="">— выбрать —</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {type === 'boolean' && (
        <label className="create-ad__toggle">
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => onChange(name, e.target.checked)}
          />
          <span className="create-ad__toggle-track">
            <span className="create-ad__toggle-thumb" />
          </span>
        </label>
      )}

      {type === 'address' && (
        <AddressAutocomplete
          onAddressSelect={addr => onChange(name, addr)}
        />
      )}
    </div>
  );
};

export default CreateAdPage;
