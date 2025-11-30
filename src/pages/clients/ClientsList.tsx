import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

type APIUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  role?: string;
}

const ClientsList: React.FC = () => {
  const [users, setUsers] = useState<APIUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // paging
  const [limit] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    const fetchUsers = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        if (!cancelled) {
          setUsers(Array.isArray(data.users) ? data.users : []);
          setTotal(Number(data.total ?? 0));
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError('Unable to load users');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();

    return () => { cancelled = true };
  }, [limit, skip]);

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goPrev = () => setSkip(Math.max(0, skip - limit));
  const goNext = () => setSkip(Math.min((totalPages - 1) * limit, skip + limit));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Client list</h1>

      <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <div className="text-center py-6">Loading users…</div>
        ) : error ? (
          <div className="text-center text-red-600 py-6">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center py-6">No users found.</div>
        ) : (
          <ul className="divide-y">
            {users.map(u => (
              <li key={u.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{(u.firstName || u.username) && `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() : u.username}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500 mr-2">{u.role ?? 'user'}</div>
                  <Link to={`/pages/user/${String(u.id)}/pi`} className="text-primary-700 hover:underline">View profile</Link>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* pagination */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <button onClick={goPrev} disabled={skip === 0 || loading} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
            <button onClick={goNext} disabled={skip + limit >= total || loading} className="ml-2 px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
          <div className="text-gray-600">Page {currentPage} / {totalPages} — {total} total</div>
        </div>
      </div>
    </div>
  )
}

export default ClientsList;
