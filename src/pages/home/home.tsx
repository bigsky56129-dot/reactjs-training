import React from 'react';
import { useAuth } from '../../hooks/use-auth';
import { Link } from 'react-router-dom';

// Home Dashboard Component
const Home = () => {
    const { user } = useAuth();
    const isOfficer = user?.role === 'officer';

    return (
        <div className="px-4 pt-6">
            {/* Welcome Section */}
            <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                            Welcome back{user ? `, ${user.name}` : ''}!
                        </h5>
                    </div>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                        {user 
                            ? isOfficer 
                                ? 'Access your dashboard to manage users and reviews.'
                                : 'Manage your profile and track your KYC status.'
                            : 'Please login to access your personalized dashboard.'
                        }
                    </p>
                </div>

                {/* Stats Card 1 */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-2 flex items-center justify-between">
                        <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h6>
                        <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">208</div>
                    <p className="text-sm text-green-500">
                        <span className="font-medium">↑ 12%</span> vs last month
                    </p>
                </div>

                {/* Stats Card 2 */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-2 flex items-center justify-between">
                        <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Reviews</h6>
                        <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">34</div>
                    <p className="text-sm text-yellow-500">
                        <span className="font-medium">→ 3%</span> vs last month
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {user ? (
                        <>
                            {isOfficer && (
                                <>
                                    <Link to="/pages/clients" className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                                                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">View All Users</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage user profiles</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link to="/pages/review" className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">Review Page</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Check pending reviews</p>
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            )}

                            <Link to={`/pages/user/${user.id}/pi`} className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                                        <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">My Profile</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">View & edit profile</p>
                                    </div>
                                </div>
                            </Link>

                            <Link to={`/pages/user/${user.id}/kyc`} className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                        <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">KYC Status</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Check verification</p>
                                    </div>
                                </div>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login" className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                                        <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">Login</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/auth/sign-up" className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                        <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">Sign Up</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Create new account</p>
                                    </div>
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activity / Info Section */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                        <h5 className="text-lg font-bold text-gray-900 dark:text-white">System Status</h5>
                        <span className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            Operational
                        </span>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Authentication Service</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">User Management API</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">KYC Verification System</span>
                        </li>
                    </ul>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h5 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Getting Started</h5>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Complete your profile information</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Submit KYC documents for verification</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Wait for admin approval</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;
