import React, { useEffect, useState } from "react";
import { useRace } from "../context/RaceContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Participation = () => {
  const { isParticipation, removeToParticipe, fetchUserParticipations } =
    useRace();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [detailedParticipations, setDetailedParticipations] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL_RACE;

  useEffect(() => {
    const loadParticipations = async () => {
      try {
        await fetchUserParticipations();
      } catch (error) {
        toast.error("Error al cargar las participaciones");
      }
    };

    loadParticipations();
  }, []);

  useEffect(() => {
    const fetchDetailedParticipations = async () => {
      if (!isParticipation.length) {
        setLoading(false);
        return;
      }

      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData.id) {
          throw new Error("Usuario no encontrado");
        }

        // Fetch user's detailed participations
        const response = await fetch(`${API_URL}/api/user/${userData.id}`);
        if (!response.ok) throw new Error("Error al obtener participaciones");

        const userData_participations = await response.json();

        // For each participation, fetch detailed info
        const detailedData = await Promise.all(
          userData_participations.cyclingParticipants.map(
            async (participation) => {
              try {
                const detailResponse = await fetch(
                  `${API_URL}/api/cycling_participant/${participation.id}`
                );
                if (!detailResponse.ok) {
                  throw new Error(
                    `Error fetching details for participation ${participation.id}`
                  );
                }
                return await detailResponse.json();
              } catch (error) {
                console.error(error);
                // Return basic participation data if detailed fetch fails
                return participation;
              }
            }
          )
        );

        setDetailedParticipations(detailedData);
      } catch (error) {
        console.error("Error fetching detailed participations:", error);
        toast.error("Error al cargar los detalles de participación");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedParticipations();
  }, [isParticipation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  const handleRemoveParticipation = async (participationId) => {
    try {
      await removeToParticipe(participationId);
      // Filter out the removed participation from the detailed list
      setDetailedParticipations((prev) =>
        prev.filter((p) => p.cycling.id !== participationId)
      );
    } catch (error) {
      toast.error("Error al eliminar la participación");
    }
  };

  if (detailedParticipations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            No tienes inscripciones activas
          </h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Ver carreras disponibles
          </Link>
        </div>
      </div>
    );
  }
  // Function to format time string
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    
    // If already in HH:MM:SS format, parse it
    if (timeString.includes(":")) {
      const parts = timeString.split(":");
      if (parts.length === 3) {
        return `${parts[0]}h ${parts[1]}m ${parts[2]}s`;
      } else if (parts.length === 2) {
        return `${parts[0]}m ${parts[1]}s`;
      }
    }
    
    // If it's in seconds, convert to HH:MM:SS
    try {
      const totalSeconds = parseInt(timeString, 10);
      if (!isNaN(totalSeconds)) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
          return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          return `${minutes}m ${seconds}s`;
        } else {
          return `${seconds}s`;
        }
      }
    } catch (e) {
      console.error("Error parsing time:", e);
    }
    
    // Return original if parsing fails
    return timeString;
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Mis Inscripciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {detailedParticipations.map((participation) => {
          const race = participation.cycling;
          const isCompleted =
            race.status?.toLowerCase() === "completed" ||
            race.status?.toLowerCase() === "finished";

          return (
            <div
              key={participation.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={race.image}
                  alt={race.name}
                  className={`w-full h-full object-cover ${
                    isCompleted ? "grayscale" : ""
                  }`}
                />
                {isCompleted && (
                  <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-lg font-medium">
                      FINALIZADA
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-lg">
                  {race.distance_km} km
                </div>
                {participation.dorsal && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-lg">
                    Dorsal: {participation.dorsal}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {race.name}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">Fecha:</span>{" "}
                    {new Date(race.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Ubicación:</span>{" "}
                    {race.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Categoría:</span>{" "}
                    {race.category}
                  </p>
                  {participation.time && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Tiempo:</span>{" "}
                      {formatTime(participation.time)}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/race/${race.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Ver detalles
                  </Link>
                  {!isCompleted && (
                    <button
                      onClick={() => handleRemoveParticipation(race.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Participation;
