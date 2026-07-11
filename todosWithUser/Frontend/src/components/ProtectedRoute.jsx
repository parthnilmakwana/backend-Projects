import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a blank screen or a spinner while initially checking auth
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading application...</div>;
  }

  // If there is no user logged in, kick them to the login page immediately
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there is a child passed directly (e.g., <ProtectedRoute><Component/></ProtectedRoute>)
  if (children) {
    return children;
  }

  // Otherwise, render the nested routes (for use in <Route element={<ProtectedRoute />}>)
  return <Outlet />;
};

export default ProtectedRoute;
