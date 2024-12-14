// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/dashboard" className="font-semibold text-xl">Finance Tracker</Link>
      <div>
        <Link to="/dashboard" className="mr-4">Dashboard</Link>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded text-white">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
