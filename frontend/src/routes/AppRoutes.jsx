// src/routes/AppRoutes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';
import PrivateRoute from '../utils/privateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Navbar />
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);

export default router;  // Ensure this is correctly exported
