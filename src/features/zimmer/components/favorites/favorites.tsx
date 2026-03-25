import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ZimmerCard from '../zimmerCard/zimmerCard';
import { Zimmer } from '../../redux/zimmerSlice';
import { RootState } from '../../../../app/store';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const favoriteZimmers = useSelector((state: RootState) => state.zimmerState.listFavoriteZimmers || []);

  return (
    <div style={{ padding: '20px', direction: 'rtl' }}>
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '8px 16px',
          cursor: 'pointer',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginBottom: '20px'
        }}
      >
        ➜ חזרה לדף הבית
      </button>

      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>המועדפים שלי ❤️</h2>
      
      {favoriteZimmers.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>רשימת המועדפים שלך ריקה.</p>
          <button 
            onClick={() => navigate('/')} 
            style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            חזרה לחיפוש צימרים
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {favoriteZimmers.map((zimmer: Zimmer) => (
            <ZimmerCard key={zimmer.zimmerId} zimmer={zimmer} viewType="grid" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;