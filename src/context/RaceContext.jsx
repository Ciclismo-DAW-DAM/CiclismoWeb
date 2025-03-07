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
        const errorData = await response.text();
        console.error("Response error:", errorData);
        throw new Error(`Error al cargar las carreras: ${response.status}`);
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
  const [isParticipation, setIsParticipation] = useState([]);
  const fetchUserParticipations = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.id) return;

      const response = await fetch(`${API_URL}/api/user/${userData.id}`);
      if (!response.ok) throw new Error('Error al obtener participaciones');
      
      const userData_participations = await response.json();
      const participatedRaces = userData_participations.cyclingParticipants.map(p => p.cycling);
      setIsParticipation(participatedRaces);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las participaciones');
    }
  };
  useEffect(() => {
    fetchUserParticipations();
  }, []);
  const addToParticipe = async (raceToAdd) => {
      if (isParticipation.some((race) => race.id === raceToAdd.id)) {
        toast.error(`${raceToAdd.name} ya estas participando`);
        return;
      }
    // Add this line after successful participation:
    await fetchUserParticipations();
  };
  const removeToParticipe = async (raceId) => {
    const raceToRemove = isParticipation.find((race) => race.id === raceId);
  
    if (raceToRemove) {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.id) {
          throw new Error('Usuario no encontrado');
        }
  
        // Get user's participations
        const response = await fetch(`${API_URL}/api/user/${userData.id}`);
        if (!response.ok) throw new Error('Error al obtener participaciones');
        const userData_participations = await response.json();
  
        // Find the participation ID for this race
        const participation = userData_participations.cyclingParticipants.find(
          (p) => p.cycling.id === raceId
        );
  
        if (!participation) {
          throw new Error('Participación no encontrada');
        }
  
        // Delete the participation
        const deleteResponse = await fetch(`${API_URL}/api/cycling_participant/${participation.id}`, {
          method: 'DELETE',
        });
  // Add this line after successful removal:
    await fetchUserParticipations();
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
        fetchUserParticipations, // Add this to the context
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
