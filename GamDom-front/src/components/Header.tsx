import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useJwt } from '../providers/JwtProvider';
import Button from './Button';

const Header: React.FC = () => {
  const {logout, user} = useJwt()

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <FaUserCircle className="text-2xl mr-2" />
        <span>{user?.email}</span>
      </div>
      <Button onClick={logout} variant="secondary" className="text-xl p-2">
        <FaSignOutAlt />
      </Button>
    </header>
  );
};

export default Header; 