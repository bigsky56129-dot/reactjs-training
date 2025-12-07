import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, searchUsers, APIUser } from '../../services/api';
import { useAuth } from '../../hooks/use-auth';
import { hasPermission } from '../../utils/rbac';
import ListView from './components/list-view';
import GridView from './components/grid-view';
import TableView from './components/table-view';

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
        {loading && <div className="text-center py-6">Loading users…</div>}
        {!loading && error && <div className="text-center text-red-600 py-6">{error}</div>}
        {!loading && !error && users.length === 0 && <div className="text-center py-6">No users found.</div>}
        {!loading && !error && users.length > 0 && (
          <>
            {viewMode === 'list' && <ListView users={users} />}
            {viewMode === 'grid' && <GridView users={users} />}
            {viewMode === 'table' && <TableView users={users} />}
          </>
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
            Found {total} result{total === 1 ? '' : 's'}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientsList;
