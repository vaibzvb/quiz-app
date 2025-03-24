import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  return true ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
