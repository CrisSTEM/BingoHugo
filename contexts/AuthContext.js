import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          // puedes añadir más detalles aquí si es necesario
        });
        // Aquí también podrías establecer isAuthenticated a true
      } else {
        setUser(null);
        // Y establecer isAuthenticated a false
      }
    });

    // Se desuscribe a la escucha cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, isAuthenticated, setIsAuthenticated }}>{children}</AuthContext.Provider>;
};
