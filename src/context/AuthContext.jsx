import { createContext, useState, useContext } from "react";

const API_URL = import.meta.env.VITE_API_URL_RACE;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
      return data;
    } catch (error) {
      return { message: "Error de conexión" };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (userData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/${user.id}/edit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        return data;
      }
      return data;
    } catch (error) {
      console.error("Update user error:", error);
      return { message: "Error updating user" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
};
