import { useState } from 'react';
import UserManagement from '../userManagement';
import ZimmerManagement from '../zimmerManagement';
import './AdminPanel.css'; // ייבוא ה-CSS

const AdminPanel = () => {
  const [tab, setTab] = useState<'users' | 'zimmers'>('users');

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
      </div>

      <div className="management-content">
        {tab === 'users' && <UserManagement />}
        {tab === 'zimmers' && <ZimmerManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;