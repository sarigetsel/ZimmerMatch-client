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
  [FacilityValues.BBQ]: <Icons.FaFire />,
  [FacilityValues.Kitchen]: <Icons.FaUtensils />,
  [FacilityValues.Heating]: <Icons.FaThermometerHalf />,
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

const rawFacilities = zimmer.facilities;
  let facilitiesNum = 0;

  if (typeof rawFacilities === 'number') {
    facilitiesNum = rawFacilities;
  } else if (typeof rawFacilities === 'string') {
    const parsed = parseInt(rawFacilities, 10);
    if (!isNaN(parsed)) {
      facilitiesNum = parsed;
    } else {
      const facilityNames = rawFacilities.split(',').map(s => s.trim().toLowerCase());
      
      Object.entries(FacilityValues).forEach(([key, value]) => {
        if (isNaN(Number(key)) && facilityNames.includes(key.toLowerCase())) {
          facilitiesNum |= Number(value);
        }
      });
    }
  }

  const facilitiesArray = facilitiesNum > 0
    ? Object.entries(FacilityValues)
        .filter(([key, value]) => {
          const val = Number(value);
          return isNaN(Number(key)) && val > 0 && (facilitiesNum & val) === val;
        })
        .map(([, value]) => ({
          name: FacilityLabels[Number(value)] || "מתקן",
          icon: facilitiesIconsMap[Number(value)] || <span>🔹</span>,
        }))
    : [];
    console.log("Raw Facilities from API:", zimmer.facilities);
console.log("Calculated facilitiesNum:", facilitiesNum);
console.log("FacilityValues entries:", Object.entries(FacilityValues));

  return (
    <div className="zimmer-details-container" dir="rtl">
      <button className="back-btn" onClick={() => navigate(-1)}>
        חזרה
      </button>

      <div className="zimmer-main">
        <div className="zimmer-info">
          <h1 className="zimmer-name">{zimmer.nameZimmer}</h1>

          <div className="zimmer-location-block">
            <span className="zimmer-city">📍 {zimmer.city}</span>
            {zimmer.address && (
              <span className="zimmer-address">{zimmer.address}</span>
            )}
          </div>

          <div className="zimmer-price-block">
            <span className="zimmer-price-amount">₪{zimmer.pricePerNight}</span>
            <span className="zimmer-price-label">ללילה</span>
          </div>

          <div className="zimmer-meta-row">
            <div className="meta-chip">
              <Icons.FaDoorOpen />
              <span>{zimmer.numRooms} חדרים</span>
            </div>
          </div>

          <div className="facilities-section">
            <h3 className="facilities-title">
              <Icons.FaStar className="facilities-title-icon" />
              מתקנים
            </h3>
            {facilitiesArray.length > 0 ? (
              <div className="zimmer-facilities">
                {facilitiesArray.map((f, idx) => (
                  <div key={idx} className="facility">
                    <span className="facility-icon">{f.icon}</span>
                    <span className="facility-name">{f.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-facilities">לא צוינו מתקנים לצימר זה</p>
            )}
          </div>

          <button className="show-map-btn" onClick={() => setMapVisible(!mapVisible)}>
            <Icons.FaMapMarkerAlt />
            {mapVisible ? "הסתר מפה" : "הצג מיקום במפה"}
          </button>

          {mapVisible && (
            <div className="map-wrapper">
              <div className="map-type-buttons">
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
              <div className="zimmer-inline-map">
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

          <div className="zimmer-description-block">
            <h3 className="description-title">אודות הצימר</h3>
            <p className="zimmer-description">{zimmer.description}</p>
          </div>
        </div>

        <div className="zimmer-gallery">
          {images.length > 0 ? (
            <>
              <img
                src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
                className="main-image"
                alt={zimmer.nameZimmer}
                onClick={() => setModalOpen(true)}
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
          <button
            className="modal-close-btn"
            onClick={(e) => { e.stopPropagation(); setModalOpen(false); }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ZimmerDetails;