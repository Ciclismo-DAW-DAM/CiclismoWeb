import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="m-5 p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-40px)]">
      <h2 className="text-2xl font-bold mb-6">Perfil de Usuario</h2>

      <div className="bg-gray-300 p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Nombre de Usuario:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="w-48 bg-teal-700 text-white py-2 px-4 rounded-md hover:bg-teal-800"
            >
              Actualizar Perfil
            </button>
            <button
              type="button"
              className="w-48 bg-teal-700 text-white py-2 px-4 rounded-md hover:bg-teal-800"
            >
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center mt-12">
        <button
          onClick={handleLogout}
          className="w-full bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-5 00 hover:text-white"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Profile;
