import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './features/user/components/navbar/navbar';
import AdminPanel from './features/admin/components/adminPanel/adminPanel';
import ProtectedRoute from './features/admin/components/protectedRoute';
import { useSelector } from 'react-redux';
import {type RootState } from './app/store';
import ZimmerList from './features/zimmer/components/zimmerList/zimmerList';
import MyZimmers from './features/zimmer/components/myZimmers';
import ZimmerDetails from './features/zimmer/components/zimmerDetails/zimmerDetails';

function App() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
  <BrowserRouter>
    <Navbar/>
    
    <Routes>
      <Route
      path="/"
      element={
  <div className="App">
      <header >
      <h1>מערכת הזמנת צימרים</h1>
      </header>
      <ZimmerList />
  </div>
  }
  />
  <Route path="/admin" element={
    <ProtectedRoute currentUser={currentUser} allowedRoles={["Admin"]}>
      <AdminPanel />
    </ProtectedRoute>
  } />

  <Route
  path="/my-zimmers"
  element={
    <ProtectedRoute currentUser={currentUser} allowedRoles={["Owner"]}>
      <MyZimmers />
    </ProtectedRoute>
  }
/>
  <Route path="/" element={<ZimmerList />} />
  <Route path="/zimmer/:id" element={<ZimmerDetails />} />
  </Routes>
  </BrowserRouter>
  );
}

export default App;

