import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Layout from '../components/Layout';

const Root: React.FC = () => {
  return (
    <Layout email="user@example.com" onLogout={() => console.log('Logout')}>
    <div className="flex flex-col items-center justify-start h-screen bg-gray-900 text-white p-4"> 
      <h1 className="text-4xl font-bold mb-2 text-center mt-10">Welcome to the Sports Betting App</h1> 
      <p className="mt-4 text-lg text-gray-300 text-center">Your one-stop solution for all sports betting needs.</p>

      <div className="mt-6 w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-0"> 
        <nav className="flex">
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `flex-1 text-center py-2 transition duration-300 ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`
            }
          >
            Sports Events
          </NavLink>
          <NavLink
            to="/my-bets"
            className={({ isActive }) =>
              `flex-1 text-center py-2 transition duration-300 ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`
            }
          >
            My Bets
          </NavLink>
        </nav>
        <div className="p-4"> 
          <Outlet /> 
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Root;