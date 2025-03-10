import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RootLayout() {
  const { navigate } = useNavigate();
  const { isAuthenticated ,user } = useAuth();
  
  function handlenavigate() {
    navigate("/login");
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <nav className="bg-[#00ffaa] shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/images/logo.png" 
                  alt="CiclismoWeb Logo" 
                  className="h-10 w-auto mr-2"
                />
                <span className="text-xl font-bold text-gray-800 pl-0">
                  CiclismoWeb
                </span>
              </Link>
              {/* Rest of the navigation items */}
              <div className="hidden sm:flex sm:ml-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Inicio
                </Link>
                <Link
                  to="/participation"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Participaciones
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              {isAuthenticated && (
                <div className="flex space-x-2">
                  <Link
                    to="/home"
                    className="text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md text-sm font-medium"
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/participation"
                    className="text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md text-sm font-medium"
                  >
                    Participaciones
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md text-sm font-medium"
                  >
                    Perfil
                  </Link>
                </div>
              )}
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                 {user?.image && (
                      <img 
                        src={user.image || "https://via.placeholder.com/32"} 
                        alt="Perfil" 
                        className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-300"
                      />
                    )}
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    
                    Mi Perfil
                  </Link>
                 
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={handlenavigate}
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Iniciar Sesion
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main
        className="flex-grow py-6"
        style={{
          background: "linear-gradient(135deg, #001f3d 0%, #020D24 100%)",
          position: "relative",
        }}
      >
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default RootLayout;
