import React, { useCallback, useRef, useState } from "react";
import { useRace } from "../context/RaceContext";
import RaceCard from "../components/RaceCard";
import Spinner from "../components/Spinner";
import SearchBar from "../components/SearchBar";

function Home() {
  const { races, loading, hasMore, loadMore, searchResults } = useRace();
  const observer = useRef();
  const [filters, setFilters] = useState({
    category: "",
    distance: "",
    location: "",
  });

  const lastRaceElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const currentDate = new Date();
  const filteredRaces = (searchResults.length > 0 ? searchResults : races)
    .filter((race) => {
      const raceDate = new Date(race.date);
      return raceDate >= currentDate;
    })
    .filter((race) => {
      const distanceNum = race.distance_km ? parseInt(race.distance_km) : 0;
      const locationMatch = race.location
        ? race.location.toLowerCase().includes(filters.location.toLowerCase())
        : false;

      return (
        (!filters.category || race.category === filters.category) &&
        (!filters.distance || (
          (filters.distance === "short" && distanceNum <= 50) ||
          (filters.distance === "medium" && distanceNum > 50 && distanceNum <= 100) ||
          (filters.distance === "long" && distanceNum > 100)
        )) &&
        (!filters.location || locationMatch)
      );
    });
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="-mt-12">
        <SearchBar />
      </div>

      {/* Filter Controls */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-2 rounded-md border"
        >
          <option value="">Todas las categorías</option>
          <option value="Gran Fondo">Gran Fondo</option>
          <option value="Etapas">Etapas</option>
          <option value="Ultra Fondo">Ultra Fondo</option>
          <option value="Clásica">Clásica</option>
          <option value="Montaña">Montaña</option>
          <option value="Costa">Costa</option>
          <option value="Aventura">Aventura</option>
          <option value="Cultural">Cultural</option>
          <option value="Naturaleza">Naturaleza</option>
        </select>

        <select
          name="distance"
          value={filters.distance}
          onChange={handleFilterChange}
          className="p-2 rounded-md border"
        >
          <option value="">Todas las distancias</option>
          <option value="short">Corta (menos de 50km)</option>
          <option value="medium">Media (entre 51-100km)</option>
          <option value="long">Larga (mas 100km)</option>
        </select>

        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Filtrar por ubicación"
          className="p-2 rounded-md border"
        />
      </div>

      <h1 className="text-3xl font-bold text-white mb-6">
        {searchResults.length > 0 ? 
          "Carreras Encontradas" : 
          "Carreras Disponibles"
        }
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRaces.map((race, index) => (
          <div
            key={race.id}
            ref={index === filteredRaces.length - 1 ? lastRaceElementRef : null}
          >
            <RaceCard race={race} />
          </div>
        ))}
      </div>
      {loading && <Spinner />}
    </div>
  );
}

export default Home;
