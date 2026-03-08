import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const yellowIcon = new L.Icon({
  iconUrl:"https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize:[32,32]
});

export default function ZimmerSingleMap({ lat, lng }:{lat:number,lng:number}) {

  return (
    <MapContainer
      center={[lat,lng]}
      zoom={14}
      style={{height:"400px"}}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[lat,lng]}
        icon={yellowIcon}
      />

    </MapContainer>
  );
}