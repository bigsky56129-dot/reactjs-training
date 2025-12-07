import React from 'react';
import { formatISODate } from '../../../utils/date';

export type UserDetailProps = {
  id: number | string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  birthDate?: string;
};

const UserDetail: React.FC<UserDetailProps> = ({ id, name, email, phone, image, birthDate }) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <img className="w-20 h-20 rounded-md object-cover" src={image ?? `${process.env.PUBLIC_URL}/images/users/bonnie-green-2x.png`} alt={name ?? 'user'} />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name ?? 'User'}</h3>
          <div className="text-sm text-gray-500 dark:text-gray-300">{email}</div>
          {phone ? <div className="text-sm text-gray-500">{phone}</div> : null}
        </div>
      </div>
      {birthDate ? <div className="mt-3 text-xs text-gray-400">Born: {formatISODate(birthDate)}</div> : null}
    </div>
  );
}

export default UserDetail;
