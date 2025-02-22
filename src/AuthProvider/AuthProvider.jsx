import React, { createContext, useEffect, useState } from "react";
import app from "../Firebase/firebase.config";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";

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
      if (currentUser?.email) {
        
          axios.post("http://localhost:5000/users", {
            name: currentUser?.displayName || "Anonymous",
            image: currentUser?.photoURL || "https://via.placeholder.com/150",
            email: currentUser?.email,
            isAdmin: false,
          })
          .then((response) => {
            if (response.data.message === "User already exists") {
              // console.log("User already exists in the database.");
            } else {
              // console.log("User added to the database successfully.");
            }
          })
          .catch((error) => {
            // console.error("Error saving user to the database:", error);
          });
      }
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
