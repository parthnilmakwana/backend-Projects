import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user data exactly once when the app starts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Expose a login function so Login.jsx can instantly update the global state
  const login = (userData) => {
    setUser(userData);
  };

  // Expose a logout function so Navbar.jsx can clear the state and hit the backend
  const logout = async () => {
    try {
      await api.post("/users/logout");    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
