import { createContext, useState, useContext } from "react";

const API_URL = import.meta.env.VITE_API_URL_RACE;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = localStorage.getItem("user");
    return !!user; // Returns true if user exists in localStorage
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
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
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      return { message: "Error de conexión" };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Remove user data from localStorage on logout
    localStorage.removeItem("user");
  };

  const updatePassword = async (oldPassword, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/api/user/${user.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldpassword: oldPassword,
          newpassword: newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, message: "Password updated successfully" };
      }
      return data;
    } catch (error) {
      console.error("Update password error:", error);
      return { message: "Error updating password" };
    }
  };
  const updateUsername = async (newName) => {
    try {
      const response = await fetch(`${API_URL}/api/user/${user.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      const data = await response.json();
      if (response.ok) {
        // Update the user in state and localStorage
        const updatedUser = { ...user, name: newName };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { user: updatedUser };
      }
      return data;
    } catch (error) {
      console.error("Update username error:", error);
      return { message: "Error updating username" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUsername,
        updatePassword,
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
