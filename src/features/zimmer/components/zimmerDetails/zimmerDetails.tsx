import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useState, useEffect } from 'react';
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
  [FacilityValues.AirConditioning]: <Icons.FaSnowflake />,
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
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ZimmerDetails: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [mapType, setMapType] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: zimmers, isLoading, isError } = useGetZimmersQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) return <div className="loading-container">טוען נתונים...</div>;
  if (isError || !zimmers) return <div className="error-container">שגיאה בטעינת הנתונים</div>;

  const zimmer: Zimmer | undefined = zimmers.find((z) => Number(z.zimmerId) === Number(id));

  if (!zimmer) {
    return (
      <div className="error-container">
        <h2>הצימר לא נמצא</h2>
        <button onClick={() => navigate('/')}>חזרה לדף הבית</button>
      </div>
    );
  }

  const images = Array.isArray(zimmer.arrImages) ? zimmer.arrImages : [];

  const facilitiesNum =
    typeof zimmer.facilities === 'string'
      ? parseInt(zimmer.facilities)
      : zimmer.facilities;

  const facilitiesArray =
    typeof facilitiesNum === 'number'
      ? (Object.values(FacilityValues) as number[])
          .filter((value) => (facilitiesNum & value) === value)
          .map((value) => ({
            name: FacilityLabels[value] || '',
            icon: facilitiesIconsMap[value] || <span>🔹</span>,
          }))
      : [];

  return (
    <div className="zimmer-details-container" dir="rtl">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ חזרה
      </button>

      <div className="zimmer-main">
        <div className="zimmer-info">
          <h1 className="zimmer-name">{zimmer.nameZimmer}</h1>
          <p className="zimmer-city">📍 {zimmer.city}</p>
          <p className="zimmer-price"><strong>₪{zimmer.pricePerNight}</strong> ללילה</p>
          <p className="zimmer-rooms">מספר חדרים: {zimmer.numRooms}</p>

          <div className="zimmer-facilities">
            {facilitiesArray.map((f, idx) => (
              <div key={idx} className="facility">
                {f.icon && <span className="facility-icon">{f.icon}</span>}
                <span className="facility-name">{f.name}</span>
              </div>
            ))}
          </div>

          <button className="show-map-btn" onClick={() => setMapVisible(!mapVisible)}>
            {mapVisible ? "הסתר מפה" : "הצג מיקום במפה"}
          </button>

          {mapVisible && (
            <div className="map-wrapper" style={{ marginTop: '15px' }}>
              <div className="map-type-buttons" style={{ marginBottom: '10px', display: 'flex', gap: '5px' }}>
                <button 
                  className="map-btn" 
                  onClick={() => setMapType("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")}
                >
                  מפה רגילה
                </button>
                <button 
                  className="map-btn" 
                  onClick={() => setMapType("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png")}
                >
                  מפה טופוגרפית
                </button>
              </div>
              <div className="zimmer-inline-map" style={{ height: "300px", borderRadius: '8px', overflow: 'hidden' }}>
                <MapContainer
                  center={[zimmer.latitude, zimmer.longitude]}
                  zoom={14}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url={mapType} />
                  <Marker position={[zimmer.latitude, zimmer.longitude]} icon={yellowIcon} />
                </MapContainer>
              </div>
            </div>
          )}

          <p className="zimmer-description" style={{ marginTop: '20px' }}>{zimmer.description}</p>
        </div>

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
                    className={`thumbnail ${idx === currentImageIndex ? "active" : ""}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    alt={`תמונה ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-image-placeholder">אין תמונות זמינות</div>
          )}
        </div>
      </div>

      <h2 className="availability-title">בדיקת זמינות</h2>
      <div className="availability-section">
        <ZimmerAvailability
          zimmerId={zimmer.zimmerId}
          pricePerNight={zimmer.pricePerNight}
          zimmer={zimmer}
        />
      </div>

      {modalOpen && (
        <div className="image-modal" onClick={() => setModalOpen(false)}>
          <img 
            src={`data:image/jpeg;base64,${images[currentImageIndex]}`} 
            className="modal-image" 
            alt="תצוגה מלאה" 
          />
          <button className="modal-close-btn" onClick={() => setModalOpen(false)}>✖</button>
        </div>
      )}
    </div>
  );
};

export default ZimmerDetails;