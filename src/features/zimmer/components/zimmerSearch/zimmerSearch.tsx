import React, { useState, useEffect } from "react";
import { useGetCitiesQuery, ZimmerSearchDto } from "../../redux/zimmerApi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./zimmerSearch.css";

interface ZimmerSearchProps {
  onSearchChange: (params: ZimmerSearchDto) => void;
  onToggleMap: () => void;
}

const ZimmerSearch: React.FC<ZimmerSearchProps> = ({ onSearchChange, onToggleMap }) => {
  const [searchParams, setSearchParams] = useState({
    searchText: "",
    city: "",
    maxPrice: 3000,
    hasPool: false,
    hasJacuzzi: false,
  });

  const { data: cities } = useGetCitiesQuery();

  useEffect((): void => {
    const mapped: ZimmerSearchDto = {
      FreeText:   searchParams.searchText || undefined,
      City:       searchParams.city        || undefined,
      MaxPrice:   searchParams.maxPrice > 0 ? searchParams.maxPrice : undefined,
      HasPool:    searchParams.hasPool     ? true : undefined,
      HasJacuzzi: searchParams.hasJacuzzi  ? true : undefined,
    };
    onSearchChange(mapped);
  }, [searchParams, onSearchChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  return (
    <div className="search-container-overlay">
      <div className="search-bar-row">

        <div className="search-inputs-row">
          <div className="search-input-group">
            <span className="input-label">חיפוש</span>
            <input
              type="text"
              name="searchText"
              placeholder="שם, תיאור, מיקום…"
              value={searchParams.searchText}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="search-input-group">
            <span className="input-label">עיר</span>
            <input
              list="cities-list"
              name="city"
              placeholder="כל הערים"
              value={searchParams.city}
              onChange={handleChange}
              autoComplete="off"
            />
            <datalist id="cities-list">
              {cities?.map((city: string) => <option key={city} value={city} />)}
            </datalist>
          </div>
        </div>

        <div className="search-controls-row">

          <div className="slider-wrapper">
            <span className="slider-label">
              עד <span>₪{searchParams.maxPrice.toLocaleString()}</span>
            </span>
            <div className="slider-track">
              <Slider
                min={0}
                max={15000}
                step={100}
                value={searchParams.maxPrice}
                onChange={(v: number | number[]) =>
                  setSearchParams({ ...searchParams, maxPrice: v as number })
                }
              />
            </div>
          </div>

          <div className="controls-divider" />

          <div className="facilities-filter">
            <label className={`facility-pill${searchParams.hasPool ? ' checked' : ''}`}>
              <input
                type="checkbox"
                checked={searchParams.hasPool}
                onChange={e => setSearchParams({ ...searchParams, hasPool: e.target.checked })}
              />
              🏊 בריכה
            </label>
            <label className={`facility-pill${searchParams.hasJacuzzi ? ' checked' : ''}`}>
              <input
                type="checkbox"
                checked={searchParams.hasJacuzzi}
                onChange={e => setSearchParams({ ...searchParams, hasJacuzzi: e.target.checked })}
              />
              🛁 ג׳קוזי
            </label>
          </div>

          <div className="controls-divider" />

          <div className="search-action-btns">
            <button className="map-btn" type="button" onClick={onToggleMap}>
              🗺️ מפה
            </button>
            <button className="search-btn" type="button">
              🔍 חפש
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ZimmerSearch;