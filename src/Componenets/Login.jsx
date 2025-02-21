import React, { useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { FcGoogle } from "react-icons/fc";
import toast  from "react-hot-toast";
import { AuthContext } from "../AuthProvider/AuthProvider";

const Login = () => {
  const emailRef = useRef();
  const { userLogin, setUser, handleSignInWithGoogle, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  

  const loginWithGoogle = () => {
    setLoading(true);
    handleSignInWithGoogle()
      .then((result) => {
        const user = result.user;
        setUser(user);
        toast.success("You have logged in successfully!");
        const redirectPath = location.state?.from?.pathname || "/";
        navigate(redirectPath, { replace: true });
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to log in with Google. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-500 via-green-600 to-green-700">
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Welcome !</h2>
        <p className="text-sm text-center text-gray-600 mb-4">Login to access your account</p>
        
       
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium shadow-sm"
        >
          <FcGoogle className="mr-2 text-lg" />Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
