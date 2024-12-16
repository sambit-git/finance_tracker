// src/routes/AppRoutes.jsx
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Navbar from "../components/NavBar.jsx";
import PrivateRoute from "../utils/privateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Navbar />
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);

export default router; // Ensure this is correctly exported
