import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="h-32 bg-gray-100 border-b border-gray-200"></div>
        <div className="px-6 sm:px-8 pb-8 relative">
          <div className="relative -top-12">
            <div className="w-24 h-24 bg-white border-4 border-white rounded-full flex items-center justify-center text-3xl font-bold text-gray-400 bg-gray-50 shadow-sm">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="-mt-4">
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-500 mt-1">{user.email}</p>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Account Details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 inline-block px-2 py-1 rounded">{user._id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Joined</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Recently'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
