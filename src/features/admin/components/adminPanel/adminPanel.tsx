import { useState } from 'react';
import UserManagement from '../userManagement';
import ZimmerManagement from '../zimmerManagement';
import AdminBookings from '../BookingManagement';

import './AdminPanel.css';

const AdminPanel = () => {
  const [tab, setTab] = useState<'users' | 'zimmers' | 'bookings'>('users');

  return (
    <div className="admin-container">
      <h1 className="admin-title">ניהול מערכת</h1>

      <div className="tab-container">
        <button 
          className={`tab-button ${tab === 'users' ? 'active' : ''}`}
          onClick={() => setTab('users')}
        >
          משתמשים
        </button>
        <button 
          className={`tab-button ${tab === 'zimmers' ? 'active' : ''}`}
          onClick={() => setTab('zimmers')}
        >
          צימרים
        </button>
        <button
          className={`tab-button ${tab === 'bookings' ? 'active' : ''}`}
          onClick={() => setTab('bookings')}
        >
          הזמנות
        </button>
      </div>

      <div className="management-content">
        {tab === 'users' && <UserManagement />}
        {tab === 'zimmers' && <ZimmerManagement />}
        {tab === 'bookings' && <AdminBookings />}
      </div>
    </div>
  );
};

export default AdminPanel;