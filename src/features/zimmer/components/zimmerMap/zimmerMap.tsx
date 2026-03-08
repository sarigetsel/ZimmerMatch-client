import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Zimmer } from "../../redux/zimmerSlice";

interface ZimmerMapProps {
  zimmers: Zimmer[];
  inline?: boolean;
}

const yellowIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const ZimmerMap: React.FC<ZimmerMapProps> = ({ zimmers, inline = false }) => {
  const navigate = useNavigate();
  const [mapType, setMapType] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");


  useEffect(() => {
    const handler = (e: CustomEvent) => setMapType(e.detail);
    window.addEventListener("changeMapType", handler as EventListener);
    return () => window.removeEventListener("changeMapType", handler as EventListener);
  }, []);

  const center: [number, number] =
    zimmers.length > 0
      ? [zimmers[0].latitude, zimmers[0].longitude]
      : [32.0853, 34.7818]; 

  return (
    <div style={{ width: "100%", height: inline ? "500px" : "100vh", position: "relative" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000, display: "flex", gap: "5px" }}>
        <button onClick={() => setMapType("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")}>רגילה</button>
        <button onClick={() => setMapType("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png")}>לווין</button>
        <button onClick={() => setMapType("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png")}>היברידית</button>
      </div>

      <MapContainer
  center={center}
  zoom={12}
  style={{ width: "100%", height: "85%" }} 
>
  <TileLayer url={mapType} />
  {zimmers.map((z) => (
    <Marker key={z.zimmerId} position={[z.latitude, z.longitude]} icon={yellowIcon}>
      <Popup>
        <div style={{ minWidth: "200px" }}>
          <h3>{z.nameZimmer}</h3>
          <p>{z.city}</p>
          <p>₪{z.pricePerNight} ללילה</p>
          <button
            onClick={() => navigate(`/zimmer/${z.zimmerId}`)}
            style={{ marginTop: "5px", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
          >
            פרטים נוספים
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