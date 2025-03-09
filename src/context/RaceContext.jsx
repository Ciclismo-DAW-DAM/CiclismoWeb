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
  const [isParticipation, setIsParticipation] = useState([]);
  const [raceResults, setRaceResults] = useState(null);
  const [totalParticipants, setTotalParticipants] = useState({});

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

  useEffect(() => {
    fetchRaces();
    fetchUserParticipations();
  }, [page]);

  const addToParticipe = async (raceToAdd) => {
    if (isParticipation.some((race) => race.id === raceToAdd.id)) {
      toast.error(`${raceToAdd.name} ya estás participando`);
      return;
    }

    try {
      // Obtener datos del usuario de localStorage de manera segura
      const userData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;

      if (!userData || !userData.id) {
        throw new Error("Usuario no encontrado");
      }

      // Verificar si el género del usuario coincide con el de la carrera
      if (
        raceToAdd.gender &&
        userData.gender &&
        raceToAdd.gender.toLowerCase() !== userData.gender.toLowerCase()
      ) {
        toast.error(
          `Esta carrera es exclusiva para género ${
            raceToAdd.gender.toLowerCase() === "m"
              ? "masculino"
              : raceToAdd.gender.toLowerCase() === "f"
              ? "femenino"
              : "no especificado"
          }`
        );
        return;
      }

      // Registrar nuevo participante con el ID del usuario
      const registerResponse = await fetch(
        `${API_URL}/api/cycling_participant/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: userData.id,
            cycling: raceToAdd.id,
          }),
        }
      );

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || "Error al registrar participante");
      }

      // Update local state
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
      toast.success(`Participarás en ${raceToAdd.name}`);
    } catch (error) {
      toast.error(`Error al inscribirse: ${error.message}`);
    }
  };

  const removeToParticipe = async (raceId) => {
    const raceToRemove = isParticipation.find((race) => race.id === raceId);

    if (raceToRemove) {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData.id) {
          throw new Error("Usuario no encontrado");
        }

        // Get user's participations
        const response = await fetch(`${API_URL}/api/user/${userData.id}`);
        if (!response.ok) throw new Error("Error al obtener participaciones");
        const userData_participations = await response.json();

        // Find the participation ID for this race
        const participation = userData_participations.cyclingParticipants.find(
          (p) => p.cycling.id === raceId
        );

        if (!participation) {
          throw new Error("Participación no encontrada");
        }

        // Delete the participation
        const deleteResponse = await fetch(
          `${API_URL}/api/cycling_participant/${participation.id}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteResponse.ok) {
          throw new Error("Error al eliminar la participación");
        }

        // Update local state
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
      } catch (error) {
        console.error("Error:", error);
        toast.error(`Error al desinscribirse: ${error.message}`);
      }
    }
  };

  const fetchUserParticipations = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        throw new Error("Usuario no encontrado");
      }

      const response = await fetch(`${API_URL}/api/user/${userData.id}`);
      if (!response.ok) {
        throw new Error("Error al obtener participaciones");
      }

      const userData_participations = await response.json();
      const participations = userData_participations.cyclingParticipants.map(
        (p) => p.cycling
      );
      setIsParticipation(participations);
    } catch (error) {
      console.error("Error fetching participations:", error);
      toast.error(`Error al cargar las participaciones: ${error.message}`);
    }
  };

  const fetchRaceResults = async (raceId) => {
    setLoading(true);
    try {
      // Update the URL to use the API_URL constant for consistency
      const response = await fetch(`${API_URL}/api/cycling/${raceId}`);

      // Check content type before parsing
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch race results");
        } else {
          const errorText = await response.text();
          console.error("Server returned non-JSON response:", errorText);
          throw new Error("Server returned an invalid response format");
        }
      }

      // Make sure we're getting JSON before parsing
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Expected JSON but got:", text);
        throw new Error("Server returned non-JSON data");
      }

      const data = await response.json();
      setRaceResults(data);
    } catch (error) {
      console.error("Error fetching race results:", error);
      toast.error(
        `No se pudieron cargar los resultados de la carrera: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalParticipants = async (raceId) => {
    try {
      const response = await fetch(`${API_URL}/api/cycling/${raceId}`);

      const contentType = response.headers.get("content-type");
      if (
        !response.ok ||
        !contentType ||
        !contentType.includes("application/json")
      ) {
        throw new Error("Failed to fetch race data");
      }

      const data = await response.json();

      // Count non-banned participants
      const participants =
        data.cyclingParticipants?.filter((p) => !p.banned) || [];

      setTotalParticipants((prev) => ({
        ...prev,
        [raceId]: participants.length,
      }));

      return participants.length;
    } catch (error) {
      console.error("Error fetching participants count:", error);
      return 0;
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
        fetchUserParticipations,
        fetchRaceResults,
        raceResults,
        fetchTotalParticipants,
        totalParticipants,
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
