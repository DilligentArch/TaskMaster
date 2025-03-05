import React, { useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { AuthContext } from "../AuthProvider/AuthProvider";

const Login = () => {
  const { handleSignInWithGoogle, setUser, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const loginWithGoogle = () => {
    setLoading(true);
    handleSignInWithGoogle()
      .then((result) => {
        setUser(result.user);
        toast.success("You have logged in successfully!");
        navigate(location.state?.from?.pathname || "/", { replace: true });
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to log in with Google. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md border border-gray-300 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Welcome!</h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Log in to continue managing your tasks efficiently.
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition font-medium shadow-sm"
        >
          <FcGoogle className="mr-2 text-lg" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
