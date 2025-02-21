import React, { createContext, useEffect, useState } from "react";
import app from "../Firebase/firebase.config";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Create Auth Context
export const AuthContext = createContext();
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // Move provider outside the component to prevent re-creation

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Handle Google Sign-In
  const handleSignInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, provider)
      .catch((error) => {
        console.error("Google Sign-In Error:", error);
        setLoading(false);
      });
  };

  // Logout User
  const logOut = () => {
    setLoading(true);
    return signOut(auth)
      .catch((error) => {
        console.error("Logout Error:", error);
        setLoading(false);
      });
  };

  // Monitor Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  // Context Value
  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    logOut,
    handleSignInWithGoogle,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
