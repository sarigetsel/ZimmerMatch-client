import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./zimmerMap.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Zimmer } from "../../redux/zimmerSlice";

interface ZimmerMapProps {
  zimmers: Zimmer[];
  inline?: boolean;
}

const goldMarker = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const mapLayers: Record<string, string> = {
  "רגילה": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "חמה":   "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  "טופו":  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
};

const ZimmerMap: React.FC<ZimmerMapProps> = ({ zimmers, inline = false }) => {
  const navigate = useNavigate();
  const [activeLayer, setActiveLayer] = useState("רגילה");

  useEffect(() => {
    const handler = (e: CustomEvent) => setActiveLayer(e.detail);
    window.addEventListener("changeMapType", handler as EventListener);
    return () => window.removeEventListener("changeMapType", handler as EventListener);
  }, []);

  const center: [number, number] =
    zimmers.length > 0
      ? [zimmers[0].latitude, zimmers[0].longitude]
      : [32.0853, 34.7818];

  return (
    <div style={{ width: "100%", height: inline ? "100%" : "100vh", position: "relative" }}>
      {/* Layer controls */}
      <div className="map-layer-controls">
        {Object.keys(mapLayers).map(name => (
          <button
            key={name}
            className={activeLayer === name ? "active" : ""}
            onClick={() => setActiveLayer(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ width: "100%", height: "100%", minHeight: "300px" }}
      >
        <TileLayer url={mapLayers[activeLayer]} />

        {zimmers.map(z => (
          <Marker key={z.zimmerId} position={[z.latitude, z.longitude]} icon={goldMarker}>
            <Popup>
              <div className="map-popup">
                <h3>{z.nameZimmer}</h3>
                <p className="popup-city">📍 {z.city}</p>
                <p className="popup-price">
                  ₪{z.pricePerNight.toLocaleString()}
                  <small>/ לילה</small>
                </p>
                <button
                  className="map-popup-btn"
                  onClick={() => navigate(`/zimmer/${z.zimmerId}`)}
                >
                  לפרטי הצימר ←
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ZimmerMap;