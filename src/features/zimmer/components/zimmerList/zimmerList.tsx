import ZimmerCard from '../zimmerCard/zimmerCard'
import './zimmerList.css';

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
  facilities: string;
  arrImages?: string[];
}

interface Props {
  zimmers: Zimmer[];
}

const ZimmerList = ({ zimmers }: Props) => {

  if (!zimmers) return <div className="loading-message"> טוען צימרים...</div>;

  if (!zimmers || zimmers.length === 0) {
  return <h2 style={{ textAlign: "center" }}>אין תוצאות</h2>;
}
  return (
    <div className="zimmer-list-container">

      {zimmers.map((zimmer) => (
        <ZimmerCard key={zimmer.zimmerId} zimmer={zimmer} />
      ))}

    </div>
  );
};

export default ZimmerList;