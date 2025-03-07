import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

function Profile() {
  const { logout, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    roles: user?.roles || [],
    name: user?.name || "",
    banned: user?.banned || false
  });

  const [passwordData, setPasswordData] = useState({
    oldpassword: "",
    newpassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser({
        ...formData,
        oldpassword: "",
        newpassword: ""
      });
      
      if (response.user) {
        toast.success("Perfil actualizado correctamente");
      } else {
        toast.error(response.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    }
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser({
        ...formData,
        oldpassword: passwordData.oldpassword,
        newpassword: passwordData.newpassword
      });
      if (response.user) {
        toast.success("Contraseña actualizada correctamente");
        setPasswordData({
          oldpassword: "",
          newpassword: "",
        });
      } else {
        toast.error(response.message || "Error al actualizar la contraseña");
      }
    } catch (error) {
      toast.error("Error al actualizar la contraseña");
    }
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
              name="name"
              value={formData.name}
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
          </div>
        </form>
      </div>

      <div className="bg-gray-300 p-6 rounded-lg mt-6">
        <h3 className="text-xl font-bold mb-4">Cambiar Contraseña</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Contraseña Actual:
            </label>
            <input
              type="password"
              name="oldpassword"
              value={passwordData.oldpassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              Nueva Contraseña:
            </label>
            <input
              type="password"
              name="newpassword"
              value={passwordData.newpassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
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
