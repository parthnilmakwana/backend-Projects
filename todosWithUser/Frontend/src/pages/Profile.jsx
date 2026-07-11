import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/me");
        setUser(response.data.data);
      } catch (err) {
        setError("Could not load profile. You may need to log in again.");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile Settings</h1>
      
      {error && <div className="p-3 mb-4 text-red-600 bg-red-100 rounded">{error}</div>}

      {user && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
          <div className="px-6 py-4 pb-8 relative">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white absolute -top-12 flex items-center justify-center text-3xl font-bold text-gray-600 uppercase shadow-sm">
              {user.username.charAt(0)}
            </div>
            
            <div className="mt-14 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
              
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Account ID</p>
                  <p className="text-gray-800 font-mono text-sm break-all">{user._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Joined</p>
                  <p className="text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
