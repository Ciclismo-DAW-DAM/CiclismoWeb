import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

function Profile() {
  const { logout, user, updateUsername, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({  
    name: user?.name || "",
   
  });
  
  // Add a file input reference
  const fileInputRef = useRef(null);
  
  const [passwordData, setPasswordData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "", // Add confirmation field
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
      // Use the dedicated updateUsername method
      const response = await updateUsername(formData.name);
      
      if (response.user) {
        toast.success("Nombre de usuario actualizado correctamente");
      } else {
        toast.error(response.message || "Error al actualizar el nombre de usuario");
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Add validation to check if passwords match
    if (passwordData.newpassword !== passwordData.confirmpassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }
    
    try {
      // Use the dedicated updatePassword method
      const response = await updatePassword(
        passwordData.oldpassword,
        passwordData.newpassword
      );
      
      if (response.success) {
        toast.success("Contraseña actualizada correctamente");
        setPasswordData({
          oldpassword: "",
          newpassword: "",
          confirmpassword: "", // Reset confirmation field too
        });
      } else {
        toast.error(response.message || "Error al actualizar la contraseña");
      }
    } catch (error) {
      toast.error("Error al actualizar la contraseña");
    }
  };
  // Add a function to handle photo upload
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-6">
        <div className="relative mr-4">
          {console.log(user)}
          <img 
            src={user.image || "https://via.placeholder.com/80"} 
            alt="Foto de perfil"
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-500"
          />
          {/* Add file input (hidden) and update the button to trigger it */}
        </div>
        <h2 className="text-2xl font-bold text-center">Mi Perfil</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b">
        <button
          className={`flex-1 py-2 font-medium ${
            activeTab === "profile" 
              ? "text-teal-700 border-b-2 border-teal-700" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Datos Personales
        </button>
        <button
          className={`flex-1 py-2 font-medium ${
            activeTab === "password" 
              ? "text-teal-700 border-b-2 border-teal-700" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("password")}
        >
          Cambiar Contraseña
        </button>
      </div>
      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Edad
              </label>
              <p className="p-2 bg-gray-50 rounded-md text-gray-700">
                {user?.age || 'No especificada'}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Género
              </label>
              <p className="p-2 bg-gray-50 rounded-md text-gray-700">
                {user?.gender?.toLowerCase() === 'm' ? 'Masculino' : 
                 user?.gender?.toLowerCase() === 'f' ? 'Femenino' : 
                 'No especificado'}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Nombre de Usuario
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 mt-1">El email, edad y género no se pueden modificar</p>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-2 px-4 rounded-md hover:bg-teal-800 transition-colors"
            >
              Actualizar Perfil
            </button>
          </form>
        </div>
      )}
      {/* Password Tab */}
      {activeTab === "password" && (
        <div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Contraseña Actual
              </label>
              <input
                type="password"
                name="oldpassword"
                value={passwordData.oldpassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Nueva Contraseña
              </label>
              <input
                type="password"
                name="newpassword"
                value={passwordData.newpassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                name="confirmpassword"
                value={passwordData.confirmpassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-2 px-4 rounded-md hover:bg-teal-800 transition-colors"
            >
              Cambiar Contraseña
            </button>
          </form>
        </div>
      )}
      {/* Logout Button */}
      <div className="mt-8 pt-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Profile;
