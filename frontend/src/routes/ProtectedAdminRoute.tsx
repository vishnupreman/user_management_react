import { Navigate } from "react-router-dom";
import { useAppSelector } from "../Hooks/reduxHooks";

interface ProtectedAdminRouteProps {
  element: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ element }) => {
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);


  if (loading) return <div>Loading...</div>;

  
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return <>{element}</>;
};

export default ProtectedAdminRoute;
