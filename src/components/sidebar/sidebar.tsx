import {Link} from "react-router-dom";
import React from "react";
import {useAuth} from "../../hooks/use-auth";
import {hasPermission} from "../../utils/rbac";

interface MenuItem {
    name: string;
    link: string;
    icon?: React.ReactNode;
    permission?: string;
}

const Sidebar = () => {
    const { user } = useAuth();

    const menuItems: MenuItem[] = [
        {
            name: 'Home',
            link: "/pages/home",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
            )
        },
        {
            name: 'Clients',
            link: "/pages/clients",
            permission: 'view:all-profiles',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                </svg>
            )
        },
        {
            name: 'Review',
            link: "/pages/review",
            permission: 'access:review-page',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd"></path>
                </svg>
            )
        },
        {
            name: 'My Profile',
            link: user?.id ? `/pages/user/${user.id}/pi` : "#",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
            )
        }
    ];

    // Filter menu items based on permissions
    const visibleItems = menuItems.filter(item => {
        if (!item.permission) return true;
        return user && hasPermission(user.role, item.permission as any);
    });
    return (
        <aside id="sidebar"
               className="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width"
               aria-label="Sidebar">
            <div
                className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                    <div
                        className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        <ul className="pb-2 space-y-2">
                            {
                                visibleItems.map((item) => (
                                    <li key={item.link}>
                                        <Link to={item.link}
                                           className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700">
                                            <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                                                {item.icon}
                                            </span>
                                            <span className="ml-3">{item.name}</span>
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar