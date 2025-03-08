import React, { useState } from 'react';
import { toast } from "sonner";
import Spinner from "../components/Spinner";
import { useRace } from '../context/RaceContext';
import RaceCard from "../components/RaceCard";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const { handleSearch, searchResults , setSearchResults } = useRace();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      handleSearch(search);
      
      
    } catch (error) {
      toast.error(`Error al buscar la carrera, ${error}`, {
        style: {
          background: "red",
          color: "white",
          border: "2px solid red",
        },
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value === '') {
      handleSearch('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <form className="max-w-md mx-auto bg-white p-1 rounded-xl shadow-lg" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input 
            className="flex-1 p-2 border-gray-200 border rounded-lg focus:outline-[#00ffaa]"
            type="text" 
            value={search} 
            placeholder="Nombre de carrera"
            onChange={handleInputChange}
          />
          <button 
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900" 
            type="submit"
          >
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
