import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetZimmersQuery } from '../../redux/zimmerApi';
import './zimmerDetails.css';
import { FacilityValues, FacilityLabels } from '../../../../common/constants/enums';
import * as Icons from 'react-icons/fa';
import ZimmerAvailability from "../../../availability/components/ZimmerAvailability/ZimmerAvailability";

interface Zimmer {
  zimmerId: number;
  ownerId: number;
  nameZimmer: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  numRooms: number;
  pricePerNight: number;
  description: string;
  createdAt: string;
  arrImages?: string[];
  facilities?: number | string;
}

const facilitiesIconsMap: Record<number, React.ReactNode> = {
  [FacilityValues.Pool]: <Icons.FaSwimmingPool />,
  [FacilityValues.Parking]: <Icons.FaParking />,
  [FacilityValues.Garden]: <Icons.FaTree />,
  [FacilityValues.Wifi]: <Icons.FaWifi />,
  [FacilityValues.Jacuzzi]: <Icons.FaHotTub />,
  [FacilityValues.Accessible]: <Icons.FaWheelchair />,
  [FacilityValues.AirConditioning]: <Icons.FaFire />,
  [FacilityValues.BBQ]: "גריל",
  [FacilityValues.Kitchen]: <Icons.FaUtensils />,
  [FacilityValues.Heating]: <Icons.FaFire />,
  [FacilityValues.Playground]: <Icons.FaChild />,
  [FacilityValues.Seaview]: <Icons.FaWater />,
  [FacilityValues.PrivateParking]: <Icons.FaParking />,
  [FacilityValues.BreakfastIncluded]: <Icons.FaCoffee />,
  [FacilityValues.OutdoorSeating]: <Icons.FaChair />,
  [FacilityValues.Laundry]: <Icons.FaTshirt />,
  [FacilityValues.Sauna]: <Icons.FaHotTub />,
};

const yellowIcon = new L.Icon({
  iconUrl:"https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize:[32,32],
  iconAnchor:[16,32]
});

const ZimmerDetails: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [mapType, setMapType] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: zimmers } = useGetZimmersQuery();

  if (!zimmers || !Array.isArray(zimmers)) return <div>טוען צימר...</div>;

  const zimmerId = Number(id);
  const zimmer = zimmers.find((z) => Number(z.zimmerId) === zimmerId) as Zimmer | undefined;
  if (!zimmer) return <div>צימר לא נמצא</div>;

  const images = Array.isArray(zimmer.arrImages) ? zimmer.arrImages : [];
  const facilitiesNum = typeof zimmer.facilities === 'string' ? parseInt(zimmer.facilities) : zimmer.facilities;
  const facilitiesArray = typeof facilitiesNum === 'number'
    ? (Object.values(FacilityValues) as number[])
        .filter((value) => (facilitiesNum & value) === value)
        .map((value) => ({
          name: FacilityLabels[value] || '',
          icon: facilitiesIconsMap[value] || <span>🔹</span>,
        }))
    : [];

  return (
    <div className="zimmer-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ חזרה</button>

      <div className="zimmer-main">
        {/* גלריית תמונות */}
        <div className="zimmer-gallery">
          {images.length > 0 ? (
            <>
              <img
                src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
                className="main-image"
                alt={zimmer.nameZimmer}
                onClick={() => setModalOpen(true)} 
                style={{ cursor: 'pointer' }}
              />
              <div className="thumbnails-gallery">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`data:image/jpeg;base64,${img}`}
                    className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-image-placeholder">אין תמונה</div>
          )}
        </div>

        {modalOpen && (
          <div className="image-modal" onClick={() => setModalOpen(false)}>
            <img
              src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
              className="modal-image"
              alt={zimmer.nameZimmer}
            />
            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>✖</button>
          </div>
        )}

        
        <div className="zimmer-info">
          <h1 className="zimmer-name">{zimmer.nameZimmer}</h1>
          <p className="zimmer-city">{zimmer.city}</p>
          <p className="zimmer-price">₪{zimmer.pricePerNight} ללילה</p>
          <p className="zimmer-rooms">מספר חדרים: {zimmer.numRooms}</p>

          <div className="zimmer-facilities">
            {facilitiesArray.map((f, idx) => (
              <div key={idx} className="facility">
                {f.icon && <span className="facility-icon">{f.icon}</span>}
                <span className="facility-name">{f.name}</span>
              </div>
            ))}
          </div>

<button 
  className="show-map-btn"
  onClick={() => setMapVisible(prev => !prev)}
>
   הצג במפה
</button>

{mapVisible && (
  <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
    <button onClick={() => setMapType("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")}>רגילה</button>
    <button onClick={() => setMapType("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png")}>לווין</button>
    <button onClick={() => setMapType("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png")}>היברידית</button>
  </div>
)}

{mapVisible && (
  <div className="zimmer-inline-map" style={{ marginTop: "5px", borderRadius:"8px", overflow:"hidden", height:"300px" }}>
    <MapContainer
      center={[zimmer.latitude, zimmer.longitude]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={mapType} />
      <Marker position={[zimmer.latitude, zimmer.longitude]} icon={yellowIcon} />
    </MapContainer>
  </div>
)}
          <p className="zimmer-description">{zimmer.description}</p>
          <ZimmerAvailability
            zimmerId={zimmer.zimmerId}
            pricePerNight={zimmer.pricePerNight}
             zimmer={zimmer} 
          />
        </div>
      </div>
    </div>
  );
};

export default ZimmerDetails;