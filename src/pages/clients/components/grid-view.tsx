import React from 'react';
import { Link } from 'react-router-dom';
import { getProfilePictureUrl, APIUser } from '../../../services/api';

interface GridViewProps {
  users: APIUser[];
}

const GridView: React.FC<GridViewProps> = ({ users }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(u => {
        const profilePic = getProfilePictureUrl(u.username, String(u.id), u.image);
        return (
          <div key={u.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <img 
                src={profilePic || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'} 
                alt={u.username || 'User'} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {(u.firstName || u.username) && `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() : u.username}
                </h3>
                <p className="text-sm text-gray-500 truncate">{u.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  {u.username && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      @{u.username}
                    </span>
                  )}
                  {u.gender && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {u.gender.charAt(0).toUpperCase() + u.gender.slice(1)}
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    {u.role ?? 'user'}
                  </span>
                </div>
                <Link 
                  to={`/pages/user/${String(u.id)}/pi`} 
                  className="mt-3 inline-block text-sm text-primary-700 hover:underline"
                >
                  View profile →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GridView;
