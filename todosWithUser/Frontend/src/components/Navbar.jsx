import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold tracking-tight text-gray-900">
              Tasks
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <div className="text-sm text-gray-500 pr-6 border-r border-gray-200 hidden sm:block">
                  Logged in as <span className="font-medium text-gray-900">{user.username}</span>
                </div>
                <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Log in
                </Link>
                <Link to="/" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
