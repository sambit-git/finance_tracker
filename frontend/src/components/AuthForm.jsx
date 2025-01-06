import { useRef, useState } from "react";
import { login, register } from "../api/authServices";
import { Wallet } from "lucide-react";
import Modal from "./Modal";
import { useModal } from "../hooks/useModal";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const fullNameInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const dispatch = useDispatch();

  const { isOpen, type, message, openModal, closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameInputRef.current.value;
    const password = passwordInputRef.current.value;

    openModal("loading", "Logging in..."); // Open modal with loading state
    try {
      let response;
      if (isLogin) response = await login({ username, password });
      else {
        const fullName = fullNameInputRef.current.value;
        response = await register({ fullName, username, password });
      }
      if (response.message) {
        dispatch(setUser(response));
        closeModal();
      } else openModal("error", response.error);
    } catch (error) {
      openModal("error", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Wallet className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="fullName" className="input-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                ref={fullNameInputRef}
                className="input-primary"
              />
            </div>
          )}

          <div>
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              ref={usernameInputRef}
              className="input-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              ref={passwordInputRef}
              className="input-primary"
            />
          </div>

          <div>
            <button type="submit" className="submit-button">
              {isLogin ? "Sign in" : "Register"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        message={message}
        type={type}
      />
    </div>
  );
}

export default AuthForm;
