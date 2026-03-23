import ZimmerCard from '../zimmerCard/zimmerCard';
import { type Zimmer } from '../../redux/zimmerSlice';
import './zimmerList.css';

interface Props {
  zimmers: Zimmer[];
  viewType: 'grid' | 'list';
}

const ZimmerList = ({ zimmers, viewType }: Props) => {
  if (!zimmers) return <div className="loading-message">טוענים…</div>;

  if (zimmers.length === 0) {
    return (
      <div className="no-results">
        <h2>לא נמצאו צימרים</h2>
        <p>נסו לשנות את הפילטרים או לחפש בעיר אחרת</p>
      </div>
    );
  }

  return (
    <div className={viewType === 'grid' ? 'grid-container' : 'list-container'}>
      {zimmers.map(zimmer => (
        <ZimmerCard
          key={zimmer.zimmerId}
          zimmer={zimmer}
          viewType={viewType}
        />
      ))}
    </div>
  );
};

export default ZimmerList;