import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page.
          {user && (
            <span className="block mt-2">
              Your current role: <span className="font-semibold">{user.role}</span>
            </span>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/pages"
            className="px-6 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300">
            Go to Home
          </Link>
          {user?.role === 'user' && (
            <Link
              to={`/pages/user/${user.id}/pi`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              View Your Profile
            </Link>
          )}
          {user?.role === 'officer' && (
            <Link
              to="/pages/clients"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              View Clients
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
