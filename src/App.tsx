import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './features/user/components/navbar/navbar';
import AdminPanel from './features/admin/components/adminPanel/adminPanel';
import ProtectedRoute from './features/admin/components/protectedRoute';
import { useSelector } from 'react-redux';
import { type RootState } from './app/store';

import MyZimmers from './features/zimmer/components/myZimmers/myZimmers'; 
import ZimmerDetails from './features/zimmer/components/zimmerDetails/zimmerDetails';
import MyBookings from './features/booking/components/guestBooking';
import OwnerBookings from './features/booking/components/ownerBooking/ownerBookings';
import Home from './Home';

function App() {

  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <BrowserRouter>
      <Navbar />

      <div className="app-content" style={{ paddingTop: '70px' }}>

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/zimmer/:id" element={<ZimmerDetails />} />

          <Route
            path="/my-zimmers"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["Owner"]}>
                <MyZimmers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["Admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["Guest"]}>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner-bookings"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["Owner"]}>
                <OwnerBookings />
              </ProtectedRoute>
            }
          />

        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;