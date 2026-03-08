// src/features/zimmer/components/ZimmerSearch.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchZimmersQuery, useGetCitiesQuery } from "../../redux/zimmerApi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./zimmerSearch.css";


interface Zimmer {
  zimmerId: number;
  ownerId: number;
  nameZimmer: string;
  description: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  numRooms: number;
  pricePerNight: number;
  createdAt: string;
  arrImages?: string[];
  facilities: string[]; 
}

export default function ZimmerSearch() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    searchText: "",
    city: "",
    minPrice: 0,
    maxPrice: 2000,
    numRooms: "",
    facilities: [] as string[],
  });

  const { data: cities } = useGetCitiesQuery();


  const mappedSearchParams = {
    FreeText: searchParams.searchText,
    City: searchParams.city || undefined,
    MaxPrice: searchParams.maxPrice > 0 ? searchParams.maxPrice : undefined,
    NumOfRooms: searchParams.numRooms ? Number(searchParams.numRooms) : undefined,
    HasPool: searchParams.facilities.includes("Pool") ? true : undefined,
    HasJacuzzi: searchParams.facilities.includes("Jacuzzi") ? true : undefined,
    HasSauna: searchParams.facilities.includes("Sauna") ? true : undefined,
  };

  const { data: results } = useSearchZimmersQuery(mappedSearchParams);


  const mappedResults: Zimmer[] | undefined = results?.map(z => ({
    ...z,
    facilities: Array.isArray(z.facilities)
      ? z.facilities
      : typeof z.facilities === "string"
        ? [z.facilities]
        : [],
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleFacility = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const updatedFacilities = checked
      ? [...searchParams.facilities, value]
      : searchParams.facilities.filter(f => f !== value);
    setSearchParams({ ...searchParams, facilities: updatedFacilities });
  };

  const clearSearch = () => {
    setSearchParams({
      searchText: "",
      city: "",
      minPrice: 0,
      maxPrice: 2000,
      numRooms: "",
      facilities: [],
    });
  };

  return (
    <div className="search-wrapper">
     
      <div className="search-bar-row">

        <input
          type="text"
          placeholder="🔍 חיפוש צימר..."
          name="searchText"
          value={searchParams.searchText}
          onChange={handleChange}
        />

        <input
          list="cities"
          placeholder="בחר עיר"
          name="city"
          value={searchParams.city}
          onChange={handleChange}
        />
        <datalist id="cities">
          {cities?.map(city => <option key={city} value={city} />)}
        </datalist>

        <input
          type="number"
          placeholder="מספר חדרים"
          name="numRooms"
          value={searchParams.numRooms}
          onChange={handleChange}
        />

        <div className="slider-wrapper">
          <label>טווח מחירים: ₪{searchParams.minPrice} - ₪{searchParams.maxPrice}</label>
          <Slider
            range
            min={0}
            max={10000}
            value={[searchParams.minPrice, searchParams.maxPrice]}
            onChange={(value: number | number[]) => {
              if (Array.isArray(value)) {
                setSearchParams({ ...searchParams, minPrice: value[0], maxPrice: value[1] });
              }
            }}
          />
        </div>

        <div className="facilities-filter">
          <label>
            <input type="checkbox" value="Pool" checked={searchParams.facilities.includes("Pool")} onChange={handleFacility} /> בריכה
          </label>
          <label>
            <input type="checkbox" value="Jacuzzi" checked={searchParams.facilities.includes("Jacuzzi")} onChange={handleFacility} /> ג'קוזי
          </label>
          <label>
            <input type="checkbox" value="Sauna" checked={searchParams.facilities.includes("Sauna")} onChange={handleFacility} /> סאונה
          </label>
        </div>

        <button onClick={() => navigate("/zimmer-map")}>הצג מפה</button>
        <button className="clear-btn" onClick={clearSearch}>נקה</button>
      </div>

     
      <div className="search-results">
        {mappedResults?.map((zimmer: Zimmer) => (
          <div
            key={zimmer.zimmerId}
            className="search-card"
            onClick={() => navigate(`/zimmer/${zimmer.zimmerId}`)}
          >
            {zimmer.arrImages?.[0] && (
              <img src={`data:image/jpeg;base64,${zimmer.arrImages[0]}`} className="search-image" alt={zimmer.nameZimmer} />
            )}
            <div className="card-content">
              <h3>{zimmer.nameZimmer}</h3>
              <p className="city">{zimmer.city}</p>
              <p className="price">₪{zimmer.pricePerNight} ללילה</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}