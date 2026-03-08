import { useDispatch } from 'react-redux';
import { addToFavoriteZimmers, type Zimmer } from '../../redux/zimmerSlice';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import './ZimmerCard.css';

interface ZimmerCardProps {
  zimmer: Zimmer;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ZimmerCard = ({ zimmer, showActions = false, onEdit, onDelete }: ZimmerCardProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hoverInterval = useRef<NodeJS.Timeout | null>(null);
  const images = zimmer.arrImages ?? [];

  const handleCardClick = () => {
    navigate(`/zimmer/${zimmer.zimmerId}`);
  };

  const handleMouseEnter = () => {
    if (images.length > 1) {
      hoverInterval.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 1000);
    }
  };

  const handleMouseLeave = () => {
    if (hoverInterval.current) {
      clearInterval(hoverInterval.current);
      hoverInterval.current = null;
    }
    setCurrentImageIndex(0);
  };

  return (
    <div
      className="zimmer-card"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="zimmer-image-wrapper">
        {images.length > 0 ? (
          <img
            src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
            alt={zimmer.nameZimmer}
            className="zimmer-image"
          />
        ) : (
          <div className="no-image-placeholder">אין תמונה</div>
        )}

        {images.length > 1 && (
          <div className="thumbnails">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={`data:image/jpeg;base64,${img}`}
                className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={e => { e.stopPropagation(); setCurrentImageIndex(idx); }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="card-content">
        <h3>{zimmer.nameZimmer}</h3>
        <p className="city">{zimmer.city}</p>
        <p className="price-text">₪{zimmer.pricePerNight} ללילה</p>

        <div className="card-actions" onClick={e => e.stopPropagation()}>
          <button className="fav-btn" onClick={() => dispatch(addToFavoriteZimmers(zimmer))}>
            ❤️ מועדפים
          </button>

          {showActions && (
            <>
              <button className="edit-btn" onClick={onEdit}>✏️ ערוך</button>
              <button className="delete-btn" onClick={onDelete}>🗑️ מחק</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZimmerCard;