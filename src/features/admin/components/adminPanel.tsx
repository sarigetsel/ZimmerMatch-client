import { useState } from 'react';
import UserManagement from './userManagement';
import ZimmerManagement from './zimmerManagement';

const AdminPanel = () => {
  const [tab, setTab] = useState<'users' | 'zimmers'>('users');

  return (
    <div>
      <h1>ניהול מערכת</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setTab('users')}>משתמשים</button>
        <button onClick={() => setTab('zimmers')}>צימרים</button>
      </div>

      {tab === 'users' && <UserManagement />}
      {tab === 'zimmers' && <ZimmerManagement />}
    </div>
  );
};

export default AdminPanel;