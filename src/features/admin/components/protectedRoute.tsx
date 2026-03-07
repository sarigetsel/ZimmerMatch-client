import { Navigate } from 'react-router-dom';

interface User{
    id: number;
    name:string;
    role:"Admin" | "Owner" | "Guest";
}
interface ProtectedRouteProps {
  currentUser: User | null;
  allowedRoles: ("Admin" | "Owner" | "Guest")[];
  children: React.ReactElement;
}

const ProtectedRoute = ({ currentUser,allowedRoles,children}: ProtectedRouteProps ) => {
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children; 
};

export default ProtectedRoute;