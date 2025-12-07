import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  id: number | string;
  name: string;
  email?: string;
  avatar?: string;
};

const UserCard: React.FC<Props> = ({ id, name, email, avatar }) => {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-md border bg-white dark:bg-gray-800">
      <img src={avatar ?? '/images/users/bonnie-green-2x.png'} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{name}</div>
        {email ? <div className="text-xs text-gray-500 truncate">{email}</div> : null}
      </div>
      <div>
        <Link to={`/pages/user/${id}/pi`} className="text-sm text-primary-700 hover:underline">Open</Link>
      </div>
    </div>
  );
};

export default UserCard;
