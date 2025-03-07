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
        
          <button 
            className="absolute bottom-0 right-0 bg-teal-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
            title="Cambiar foto"
            onClick={() => fileInputRef.current.click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </button>
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
              
              
              <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
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
