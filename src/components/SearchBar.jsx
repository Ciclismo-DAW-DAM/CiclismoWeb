import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "../components/Spinner";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5173/api/cycling/${search.toLowerCase()}`
      ); // Cambiar la url
      if (!response.ok) {
        toast.error("Error al buscar la carrera", {
          style: {
            background: "#fee2e2",
            color: "white",
            border: "2px solid red",
          },
          icon: "❌",
        });
        return;
      }
      console.log(await response.json());
      // Pinto una tarjeta con los detalles de la carrera
      // o redirijo a la página de detalles de la carrera
      navigate(`/search/${search.toLowerCase()}`);
    } catch (error) {
      toast.error(`Error al buscar la carrera, ${error}`, {
        style: {
          background: "#fee2e2",
          color: "white",
          border: "2px solid red",
        },
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Carrera a buscar:</h1>
      <form className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input className="flex-1 p-2 border-gray-200 border rounded-lg focus:outline-green-500"
            type="text" value={search} placeholder="Buscar carrera"
            onChange={(e) => setSearch(e.target.value)}/>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-slate-900" type="submit">
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
