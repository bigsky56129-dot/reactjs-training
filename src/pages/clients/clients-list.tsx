import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { fetchUsers, searchUsers, getProfilePictureUrl, APIUser } from '../../services/api';
import { useAuth } from '../../hooks/use-auth';
import { hasPermission } from '../../utils/rbac';

const ClientsList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  // paging
  const [limit] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);
  const [users, setUsers] = useState<APIUser[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table'>('list');

  // Check permissions
  useEffect(() => {
    if (!currentUser || !hasPermission(currentUser.role, 'view:all-profiles')) {
      navigate('/pages/unauthorized');
    }
  }, [currentUser, navigate]);

  // Fetch users or search
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (isSearching && searchQuery.trim()) {
          data = await searchUsers(searchQuery.trim());
        } else {
          data = await fetchUsers(limit, skip);
        }
        setUsers(data.users);
        setTotal(data.total);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [limit, skip, searchQuery, isSearching]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSkip(0); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSkip(0);
  };

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goPrev = () => setSkip(Math.max(0, skip - limit));
  const goNext = () => setSkip(Math.min((totalPages - 1) * limit, skip + limit));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Client list</h1>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 dark:bg-gray-700">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            aria-label="List view"
            title="List view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            aria-label="Grid view"
            title="Grid view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            aria-label="Table view"
            title="Table view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search users</label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or username..."
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
          {isSearching && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
            >
              Clear
            </button>
          )}
        </form>
        {isSearching && searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            Searching for: <span className="font-semibold">"{searchQuery}"</span>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <div className="text-center py-6">Loading users…</div>
        ) : error ? (
          <div className="text-center text-red-600 py-6">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center py-6">No users found.</div>
        ) : viewMode === 'list' ? (
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
        ) : viewMode === 'grid' ? (
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
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Photo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Username
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Gender
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {users.map(u => {
                  const profilePic = getProfilePictureUrl(u.username, String(u.id), u.image);
                  return (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {u.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <img 
                        src={profilePic || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'} 
                        alt={u.username || 'User'} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {(u.firstName || u.username) && `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() : u.username}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      @{u.username || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {u.gender ? u.gender.charAt(0).toUpperCase() + u.gender.slice(1) : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {u.role ?? 'user'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Link 
                        to={`/pages/user/${String(u.id)}/pi`} 
                        className="text-primary-700 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-400"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* pagination - hide when searching */}
        {!isSearching && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <div>
              <button onClick={goPrev} disabled={skip === 0 || loading} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
              <button onClick={goNext} disabled={skip + limit >= total || loading} className="ml-2 px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
            <div className="text-gray-600">Page {currentPage} / {totalPages} — {total} total</div>
          </div>
        )}
        {isSearching && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Found {total} result{total !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientsList;
