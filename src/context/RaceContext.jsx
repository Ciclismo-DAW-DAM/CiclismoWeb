import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL_RACE;

export const RaceContext = createContext();

export const RaceProvider = ({ children }) => {
  const [races, setRaces] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allDataFetched, setAllDataFetched] = useState(false);
  const itemsPerPage = 8;
  // Add this new function to handle search
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = races.filter((race) =>
      race.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const fetchRaces = async () => {
    if (allDataFetched) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/cycling`);
      if (!response.ok) {
        throw new Error("Error al cargar las carreras");
      }
      const data = await response.json();

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedData = data.slice(start, end);

      if (paginatedData.length === 0 || paginatedData.length < itemsPerPage) {
        setHasMore(false);
        setAllDataFetched(true);
      }

      setRaces((prevRaces) => {
        if (page === 1) return paginatedData;
        return [...prevRaces, ...paginatedData];
      });
    } catch (error) {
      console.error("Error fetching races:", error);
      toast.error("Error al cargar las carreras");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!allDataFetched) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchRaces();
  }, [page]);

  const [isParticipation, setIsParticipation] = useState(() => {
    const savedParticipations = localStorage.getItem("participations");
    return savedParticipations ? JSON.parse(savedParticipations) : [];
  });

  const addToParticipe = (raceToAdd) => {
    if (isParticipation.some((race) => race.id === raceToAdd.id)) {
      toast.error(`${raceToAdd.name} ya estas participando`, {
        style: {
          background: "red",
          color: "white",
          border: "2px solid red",
        },
      });
      return;
    }

    // Check available slots
    const currentRace = races.find((race) => race.id === raceToAdd.id);
    if (currentRace.available_slots <= 0) {
      toast.error(`No hay plazas disponibles para ${raceToAdd.name}`, {
        style: {
          background: "red",
          color: "white",
          border: "2px solid red",
        },
      });
      return;
    }

    // Update available slots
    setRaces((prevRaces) =>
      prevRaces.map((race) =>
        race.id === raceToAdd.id
          ? { ...race, available_slots: race.available_slots - 1 }
          : race
      )
    );

    setIsParticipation((prevParticipation) => [
      ...prevParticipation,
      raceToAdd,
    ]);

    toast.success(`Participaras en ${raceToAdd.name}`, {
      style: {
        background: "green",
        color: "white",
        border: "2px solid green",
      },
      icon: "👌",
    });
  };

  const removeToParticipe = (raceId) => {
    const raceToRemove = isParticipation.find((race) => race.id === raceId);

    if (raceToRemove) {
      // Restore available slot when user unregisters
      setRaces((prevRaces) =>
        prevRaces.map((race) =>
          race.id === raceId
            ? { ...race, available_slots: race.available_slots + 1 }
            : race
        )
      );

      setIsParticipation((prevParticipation) =>
        prevParticipation.filter((race) => race.id !== raceId)
      );

      toast.success(`Ya no participas en ${raceToRemove.name}`, {
        style: {
          background: "red",
          color: "white",
          border: "2px solid red",
        },
        icon: "🗑️",
      });
    }
  };
  return (
    <RaceContext.Provider
      value={{
        races,
        searchResults,
        setSearchResults,
        handleSearch,
        addToParticipe,
        removeToParticipe,
        fetchRaces,
        isParticipation,
        loading,
        hasMore,
        loadMore,
      }}
    >
      {children}
    </RaceContext.Provider>
  );
};

export const useRace = () => {
  const context = useContext(RaceContext);
  if (!context) {
    throw new Error("useRace debe estar dentro del proveedor RaceProvider");
  }
  return context;
};
