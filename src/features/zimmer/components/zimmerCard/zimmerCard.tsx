import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavoriteZimmers, removeFromFavoriteZimmers, Zimmer } from '../../redux/zimmerSlice';
import { Link } from 'react-router-dom';
import { RootState } from '../../../../app/store';
import './ZimmerCard.css';

interface ZimmerCardProps {
  zimmer: Zimmer;
  viewType?: 'grid' | 'list';
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ZimmerCard: React.FC<ZimmerCardProps> = ({
  zimmer,
  viewType = 'list',
  showActions,
  onEdit,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const favoriteZimmers = useSelector((state: RootState) => state.zimmerState.listFavoriteZimmers || []);
  const isFavorite = favoriteZimmers.some((fav: Zimmer) => fav.zimmerId === zimmer.zimmerId);
  
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images: string[] = zimmer.arrImages || [];
  const isGrid = viewType === 'grid';

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImgIndex(prev => (prev + 1) % images.length);
      }, 900);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isHovered, images.length]);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavoriteZimmers(zimmer.zimmerId));
    } else {
      dispatch(addToFavoriteZimmers(zimmer));
    }
  };

  return (
    <Link
      to={`/zimmer/${zimmer.zimmerId}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        className={isGrid ? 'zimmer-card-mini' : 'zimmer-card-wide'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setCurrentImgIndex(0); }}
      >
        <div className="card-content-side">
          <div className="top-info">
            <h3>{zimmer.nameZimmer}</h3>
            <p className="city-tag">📍 {zimmer.city}</p>
          </div>

          {!isGrid && (
            <p className="description-text">
              {zimmer.description && zimmer.description.length > 140
                ? `${zimmer.description.substring(0, 140)}…`
                : zimmer.description}
            </p>
          )}

          <div className="price-footer">
            <div className="price-tag">
              <strong>₪{zimmer.pricePerNight.toLocaleString()}</strong>
              <small>/ לילה</small>
            </div>

            {showActions ? (
              <div className="admin-actions" onClick={e => e.stopPropagation()}>
                <button className="edit-btn" onClick={e => { e.preventDefault(); onEdit?.(); }}>עריכה</button>
                <button className="delete-btn" onClick={e => { e.preventDefault(); onDelete?.(); }}>מחיקה</button>
              </div>
            ) : (
              <button
                className={`heart-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleHeartClick}
                style={{ color: isFavorite ? 'red' : 'gray', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                {isFavorite ? '❤️' : '♡'}
              </button>
            )}
          </div>
        </div>

        <div className="card-image-side">
          {images.length > 0 ? (
            <img
              src={`data:image/jpeg;base64,${images[currentImgIndex]}`}
              alt={zimmer.nameZimmer}
              className="img-fill"
            />
          ) : (
            <div className="no-img">אין תמונה</div>
          )}
          {zimmer.numRooms && (
            <span className="rooms-badge">🛏 {zimmer.numRooms} חדרים</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ZimmerCard;