import React, { useState } from "react";
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
    maxPrice: 15000,
    hasPool: false,
    hasJacuzzi: false,
  });

  const { data: cities } = useGetCitiesQuery();

  const handleExecuteSearch = () => {
    const dto: ZimmerSearchDto = {
      FreeText: searchParams.searchText.trim() || undefined,
      City: searchParams.city.trim() || undefined,
      MaxPrice: searchParams.maxPrice,
      HasPool: searchParams.hasPool || undefined,
      HasJacuzzi: searchParams.hasJacuzzi || undefined,
    };
    onSearchChange(dto);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <div className="search-container-overlay">
      <div className="search-bar-row">
        <div className="search-inputs-row">
          <div className="search-input-group">
            <span className="input-label">חיפוש חופשי</span>
            <input
              type="text"
              name="searchText"
              placeholder="הקלד טקסט..."
              value={searchParams.searchText}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteSearch()}
            />
          </div>
          <div className="search-input-group">
            <span className="input-label">עיר</span>
            <input
              list="cities-list"
              name="city"
              placeholder="בחר עיר..."
              value={searchParams.city}
              onChange={handleChange}
            />
            <datalist id="cities-list">
              {cities?.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>

        <div className="search-controls-row">
          <div className="slider-wrapper">
            <span className="slider-label">עד ₪{searchParams.maxPrice}</span>
            <Slider
              min={0}
              max={15000}
              value={searchParams.maxPrice}
              onChange={(v) => setSearchParams(prev => ({ ...prev, maxPrice: v as number }))}
            />
          </div>
          <div className="facilities-filter">
            <label className={`facility-pill ${searchParams.hasPool ? 'checked' : ''}`}>
              <input type="checkbox" name="hasPool" checked={searchParams.hasPool} onChange={handleChange} />
              🏊 בריכה
            </label>
            <label className={`facility-pill ${searchParams.hasJacuzzi ? 'checked' : ''}`}>
              <input type="checkbox" name="hasJacuzzi" checked={searchParams.hasJacuzzi} onChange={handleChange} />
              🛁 ג'קוזי
            </label>
          </div>
          <div className="search-action-btns">
            <button className="map-btn" onClick={onToggleMap}>🗺️ מפה</button>
            <button className="search-btn" onClick={handleExecuteSearch}>🔍 חפש</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZimmerSearch;