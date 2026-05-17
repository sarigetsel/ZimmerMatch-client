import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetZimmersQuery } from '../../redux/zimmerApi';
import './zimmerDetails.scss';
import { FacilityValues, FacilityLabels } from '../../../../common/constants/enums';
import * as Icons from 'react-icons/fa';
import ZimmerAvailability from "../../../availability/components/ZimmerAvailability/ZimmerAvailability";
import AiConcierge from "../../../aiPlanner/components/AiConcierge";

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
  owner?: {
    name: string;
    phone: string;
  };
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

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250); 
  }, [map]);
  return null;
};

const ZimmerDetails: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [mapType, setMapType] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
  const [chatOpen, setChatOpen] = useState(false); 

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

  return (
    <div className="zimmer-details-container" dir="rtl">
      <button className="back-btn" onClick={() => navigate(-1)}>חזרה</button>

      <div className="zimmer-main">
        <div className="zimmer-info">
          <h1 className="zimmer-name">{zimmer.nameZimmer}</h1>

          <div className="zimmer-location-block">
            <span className="zimmer-city">📍 {zimmer.city}</span>
            {zimmer.address && <span className="zimmer-address">{zimmer.address}</span>}
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
                <button className="map-btn" onClick={() => setMapType("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")}>רגילה</button>
                <button className="map-btn" onClick={() => setMapType("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png")}>חמה</button>
                <button className="map-btn" onClick={() => setMapType("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png")}>טופוגרפית</button>
              </div>
              <div className="zimmer-inline-map">
                <MapContainer center={[zimmer.latitude, zimmer.longitude]} zoom={10}>
                  <TileLayer url={mapType} />
                  <Marker position={[zimmer.latitude, zimmer.longitude]} icon={yellowIcon} />
                  <MapResizer />
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
                onClick={() => setModalOpen('image')}
              />
              <div className="thumbnails-gallery">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`data:image/jpeg;base64,${img}`}
                    className={`thumbnail ${idx === currentImageIndex ? "active" : ""}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    alt={`תמונה ${idx + 1}`}
                    loading="lazy"
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-image-placeholder">אין תמונות זמינות</div>
          )}
        </div>
      </div>

      <div className="availability-header">
        <h2 className="availability-title">בדיקת זמינות</h2>
        <div className="contact-trigger-wrapper">
          <button
            className={`contact-trigger-card ${modalOpen === 'contact' ? 'open' : ''}`}
            onClick={() => setModalOpen(modalOpen === 'contact' ? null : 'contact')}
          >
            <div className="avatar-ring"><Icons.FaUser /></div>
            <div className="trigger-text">
              <span className="trigger-label">מארח</span>
              <span className="trigger-name">{zimmer.owner?.name || 'בעלי הצימר'}</span>
            </div>
            <Icons.FaChevronDown className="trigger-chevron" />
          </button>

          {modalOpen === 'contact' && zimmer.owner && (
            <div className="contact-dropdown-panel">
              <div className="panel-header">
                <div className="panel-avatar">{zimmer.owner.name.slice(0, 2)}</div>
                <div>
                  <div className="panel-host-label">מארח הצימר</div>
                  <div className="panel-host-name">{zimmer.owner.name}</div>
                </div>
              </div>
              <div className="panel-body">
                <a className="panel-action phone" href={`tel:${zimmer.owner.phone}`}>
                  <Icons.FaPhoneAlt />
                  <div className="action-text">
                    <div className="action-label">טלפון</div>
                    <div className="action-number">{zimmer.owner.phone}</div>
                  </div>
                  <Icons.FaChevronLeft className="action-arrow" />
                </a>
                <div className="panel-divider" />
                <a
                  className="panel-action whatsapp"
                  href={`https://wa.me/972${zimmer.owner.phone.replace(/^0/, '').replace(/-/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.FaWhatsapp />
                  <div className="action-text">
                    <div className="action-label">WhatsApp</div>
                    <div className="action-number">שלח הודעה</div>
                  </div>
                  <Icons.FaChevronLeft className="action-arrow" />
                </a>
                <div className="panel-note">בדרך כלל עונה תוך שעה</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="availability-section">
        <ZimmerAvailability
          zimmerId={zimmer.zimmerId}
          pricePerNight={zimmer.pricePerNight}
          zimmer={zimmer}
        />
      </div>

      {modalOpen === 'image' && (
        <div className="image-modal" onClick={() => setModalOpen(null)}>
          <img src={`data:image/jpeg;base64,${images[currentImageIndex]}`} className="modal-image" alt="תצוגה מלאה" />
          <button className="modal-close-btn" onClick={(e) => { e.stopPropagation(); setModalOpen(null); }}>✕</button>
        </div>
      )}

      <div className="ai-floating-widget">
        <button className="ai-toggle-btn" onClick={() => setChatOpen(!chatOpen)}>
          {chatOpen ? "✕" : "התייעצו עם עוזר החופשה האישי שלכם 💬"}
        </button>

        {chatOpen && (
          <div className="ai-chat-window-wrapper">
            <AiConcierge 
              zimmerData={{ 
                name: zimmer.nameZimmer, 
                location: zimmer.city 
              }} 
              bookingDates="העונה הנוכחית" 
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default ZimmerDetails;