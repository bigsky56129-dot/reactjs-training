import React from 'react';
import { User } from '../../shared/authenticated';

interface UserMenuProps {
    user: User;
    isOpen: boolean;
    onSignOut: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, isOpen, onSignOut }) => {
    // Determine user role display
    const getRoleDisplay = (role?: 'user' | 'officer') => {
        if (!role) return 'User';
        return role === 'officer' ? 'Admin/Moderator' : 'Regular User';
    };

    const getRoleBadgeColor = (role?: 'user' | 'officer') => {
        if (role === 'officer') {
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        }
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    };

    if (!isOpen) return null;

    return (
        <div
            className="absolute right-0 top-12 mt-2 z-50 w-64 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600"
            id="dropdown-2"
            role="menu"
            aria-labelledby="user-menu-button-2"
        >
            {/* User Info Section */}
            <div className="px-4 py-3" role="none">
                <p className="text-sm font-semibold text-gray-900 dark:text-white" role="none">
                    {user.name} {user.username && <span className="text-gray-500 dark:text-gray-400 font-normal">({user.username})</span>}
                </p>
                <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300 mt-1" role="none">
                    {user.email}
                </p>
                {/* Role Badge */}
                <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {getRoleDisplay(user.role)}
                    </span>
                </div>
            </div>

            {/* Menu Items */}
            <ul className="py-1" role="none">
                <li>
                    <a
                        href="#/pages/home"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                    >
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Dashboard
                    </a>
                </li>
                <li>
                    <a
                        href={`#/pages/user/${user.id}/pi`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                    >
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        My Profile
                    </a>
                </li>
                <li>
                    <a
                        href={`#/pages/user/${user.id}/kyc`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                    >
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        KYC Status
                    </a>
                </li>
                {user.role === 'officer' && (
                    <>
                        <li>
                            <a
                                href="#/pages/clients"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                role="menuitem"
                            >
                                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                Manage Users
                            </a>
                        </li>
                        <li>
                            <a
                                href="#/pages/review"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                role="menuitem"
                            >
                                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Review Page
                            </a>
                        </li>
                    </>
                )}
            </ul>

            {/* Sign Out Section */}
            <div className="py-1">
                <button
                    onClick={onSignOut}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600 dark:hover:text-red-300"
                    role="menuitem"
                >
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Sign out
                </button>
            </div>
        </div>
    );
};

export default UserMenu;
