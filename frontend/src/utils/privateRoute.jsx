// src/utils/privateRoute.js
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../api/authServices";
import Login from "../pages/Login";
import { useEffect } from "react";
import { login } from "../store/authSlice";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetchUserProfile();
        if (res === 'Invalid or expired token') {
          localStorage.removeItem("token");
        } else {
          dispatch(login({ token, user: res.user }));
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return <Login />;
  }

  return children;
};

export default PrivateRoute;
