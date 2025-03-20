import { Navigate } from "react-router-dom";
import { useAppSelector } from "../Hooks/reduxHooks";

interface ProtectedUserRouteProps {
  element: React.ReactNode;
}

const ProtectedUserRoute: React.FC<ProtectedUserRouteProps> = ({ element }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);


  if (loading) return <div>Loading...</div>;

  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{element}</>;
};

export default ProtectedUserRoute;
