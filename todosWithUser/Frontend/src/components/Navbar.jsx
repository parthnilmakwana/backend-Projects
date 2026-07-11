import api from "../api/axios.js";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me");
        setUser(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    // Clear user tokens/session here if needed before redirecting
    // localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">TODO App</Link>
      </div>
      
      <div className="flex items-center gap-6">
        {user ? (
          <span className="text-gray-300">
            Welcome, <span className="font-semibold text-white">{user.username}</span>
          </span>
        ) : null}
        
        <div className="flex gap-4">
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <Link to="/profile" className="hover:text-blue-400 transition-colors">Profile</Link>
          <button 
            onClick={handleLogout} 
            className="hover:text-red-400 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
