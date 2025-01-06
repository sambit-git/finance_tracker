import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserProfile } from "./api/authServices";
import { setUser } from "./store/slices/authSlice";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetchUserProfile();
        if (res === "Invalid or expired token") {
          localStorage.removeItem("token");
        } else {
          dispatch(setUser({ token, user: res.user }));
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  const user = useSelector((state) => state.auth.user);
  return user ? <Dashboard /> : <AuthForm />;
}

export default App;
