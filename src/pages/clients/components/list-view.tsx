import React from 'react';
import { Link } from 'react-router-dom';
import { getProfilePictureUrl, APIUser } from '../../../services/api';

interface ListViewProps {
  users: APIUser[];
}

const ListView: React.FC<ListViewProps> = ({ users }) => {
  return (
    <ul className="divide-y">
      {users.map(u => {
        const profilePic = getProfilePictureUrl(u.username, String(u.id), u.image);
        return (
          <li key={u.id} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <img 
                src={profilePic || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'} 
                alt={u.username || 'User'} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {(u.firstName || u.username) && `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() : u.username}
                </div>
                <div className="text-sm text-gray-500 mt-1">{u.email}</div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  {u.username && (
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      @{u.username}
                    </span>
                  )}
                  {u.gender && (
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                      {u.gender.charAt(0).toUpperCase() + u.gender.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500 mr-2">{u.role ?? 'user'}</div>
              <Link to={`/pages/user/${String(u.id)}/pi`} className="text-primary-700 hover:underline">View profile</Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ListView;
