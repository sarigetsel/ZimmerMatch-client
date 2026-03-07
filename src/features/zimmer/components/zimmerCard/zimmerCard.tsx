import { useDispatch } from 'react-redux';
import { addToFavoriteZimmers, type Zimmer } from '../../redux/zimmerSlice';
import './ZimmerCard.css'; 

interface ZimmerCardProps {
  zimmer: Zimmer;
  showActions?: boolean; 
  onEdit?: () => void;
  onDelete?: () => void;
}

const ZimmerCard = ({ zimmer, showActions = false, onEdit, onDelete }: ZimmerCardProps) => {
  const dispatch = useDispatch();

  return (
    <div className="zimmer-card">
      {zimmer.arrImages && zimmer.arrImages.length > 0 ? (
<img
  src={`data:image/jpeg;base64,${zimmer.arrImages[0]}`}
  alt={zimmer.nameZimmer}
  className="zimmer-image"
/>
) : (
        <div className="no-image-placeholder">אין תמונה</div>
      )}

      <div className="card-content">
        <h3>{zimmer.nameZimmer}</h3>
        <p>{zimmer.city}</p>
        <p className="price-text">₪{zimmer.pricePerNight} ללילה</p>

        <div className="card-actions">
          <button 
            className="fav-btn"
            onClick={() => dispatch(addToFavoriteZimmers(zimmer))}
          >
            ❤️ מועדפים
          </button>
          
           
          {showActions && (
            <>
            <button className='edit-btn'onClick={onEdit}>✏️ ערוך</button>

            <button 
              className="delete-btn"
              onClick={onDelete}
            >
             🗑️ מחק
            </button>
            </>
           )}
        </div>
      </div>
    </div>
  );
};

export default ZimmerCard;