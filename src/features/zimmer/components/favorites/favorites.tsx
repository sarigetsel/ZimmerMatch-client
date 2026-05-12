import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ZimmerCard from '../zimmerCard/zimmerCard';
import { Zimmer } from '../../redux/zimmerSlice';
import { RootState } from '../../../../app/store';
import "./favorites.css";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const favoriteZimmers = useSelector((state: RootState) => state.zimmerState.listFavoriteZimmers || []);

  return (
    <div className="favorites-container">
      <button 
        className="back-to-search"
        onClick={() => navigate('/')}
      >
        ➜ חזרה לדף הבית
      </button>

      <div className="favorites-header">
        <h2>המועדפים שלי ❤️</h2>
      </div>
      
      {favoriteZimmers.length === 0 ? (
        <div className="empty-favorites">
          <p>רשימת המועדפים שלך ריקה.</p>
          <button 
            className="back-to-search"
            onClick={() => navigate('/')} 
          >
            חזרה לחיפוש צימרים
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favoriteZimmers.map((zimmer: Zimmer) => (
            <ZimmerCard key={zimmer.zimmerId} zimmer={zimmer} viewType="grid" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;