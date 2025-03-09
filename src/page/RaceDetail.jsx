import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRace } from "../context/RaceContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import RaceMap from "../components/RaceMap";
import Spinner from "../components/Spinner";

function RaceDetail() {
  const { id } = useParams();
  const {
    races,
    addToParticipe,
    removeToParticipe,
    isParticipation,
    loading,
    raceResults,
    fetchRaceResults,
    fetchTotalParticipants,
    fetchUserParticipations 
  } = useRace();
  const { isAuthenticated } = useAuth();
  const [race, setRace] = useState(null);

  useEffect(() => {
    if (races.length === 0) {
      console.log("No races loaded yet");
      return;
    }
    // Convert id to string for comparison since URL params are always strings
    const currentRace = races.find((race) => String(race.id) === String(id));
    if (!currentRace) {
      console.log("Race not found:", { searchId: id, availableRaces: races });
      return;
    }
    setRace(currentRace);

    fetchUserParticipations();

    // Fetch race results if the race is completed
    if (
      currentRace.status?.toLowerCase() === "completed" ||
      currentRace.status?.toLowerCase() === "finished"
    ) {
      fetchRaceResults(id);
    }
  }, [id, races]);

  if (races.length === 0 || !race) {
    return <Spinner />;
  }

  const isParticipating = isParticipation.some((r) => r.id === race?.id);

  const handleParticipate = () => {
    try {
      if (isParticipating) {
        removeToParticipe(race.id);
      } else {
        addToParticipe(race);
      }
    } catch (error) {
      toast.error(`Error al procesar la solicitud, ${error}`);
    }
  };

  const isRaceCompleted = () => {
    return (
      race?.status?.toLowerCase() === "completed" ||
      race?.status?.toLowerCase() === "finished"
    );
  };

  const renderActionButton = () => {
    // Don't show registration button for completed races
    if (isRaceCompleted()) {
      return (
        <div className="mt-6 text-center py-3 px-4 bg-gray-100 rounded-lg text-gray-600 font-medium">
          Carrera Finalizada
        </div>
      );
    }

    // Don't show registration button for closed races
    if (race.status.toLowerCase() === "closed") {
      return (
        <div className="mt-6 text-center py-3 px-4 bg-gray-100 rounded-lg text-gray-600 font-medium">
          Inscripciones Cerradas
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">
            Para inscribirte en esta carrera necesitas iniciar sesión
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
          >
            Iniciar Sesión
          </Link>
        </div>
      );
    }

    if (race.available_slots > 0) {
      return (
        <button
          onClick={handleParticipate}
          className={`w-full mt-6 py-3 px-4 rounded-lg text-white transition-colors duration-200 ${
            isParticipating
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={race.status.toLowerCase() !== "open"}
        >
          {isParticipating ? "Desinscribirse" : "Inscribirse"}
        </button>
      );
    }

    return (
      <div className="mt-6 text-center py-3 px-4 bg-gray-100 rounded-lg text-red-600 font-medium">
        Plazas Agotadas
      </div>
    );
  };

  const renderResultsTable = () => {
    if (!isRaceCompleted() || !raceResults || loading) {
      return null;
    }

    // Sort participants by time (assuming time is in a format that can be compared)
    const sortedParticipants = [...raceResults.cyclingParticipants]
      .filter((participant) => !participant.banned)
      .sort((a, b) => {
        // If time is in format "HH:MM:SS", we can compare as strings
        return a.time.localeCompare(b.time);
      });

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
      <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Resultados de la Carrera
          </h2>
          {loading ? (
            <Spinner />
          ) : sortedParticipants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-center">Posición</th>
                    <th className="py-3 px-4 text-center">Dorsal</th>
                    <th className="py-3 px-4 text-center">Participante</th>
                    <th className="py-3 px-4 text-center">Tiempo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedParticipants.map((participant, index) => (
                    <tr
                      key={participant.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="py-3 px-4 text-center">{index + 1}</td>
                      <td className="py-3 px-4 text-center">
                        {participant.dorsal}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {participant.user.name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {formatTime(participant.time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">
              No hay resultados disponibles para esta carrera.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-300 hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <ArrowLeftIcon className="h-5 w-5" /> Volver
      </button> */}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-72">
          <img
            src={race.image}
            alt={race.name}
            className={`w-full h-full object-cover ${
              isRaceCompleted() ? "grayscale" : ""
            }`}
          />
          {isRaceCompleted() && (
            <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
              <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-lg">
                CARRERA FINALIZADA
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h1 className="text-3xl font-bold text-white mb-2">{race.name}</h1>
            <p className="text-lg text-gray-200">{race.location}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Detalles de la Carrera
                </h2>
                <p className="text-gray-600">{race.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="text-lg font-semibold">
                    {new Date(race?.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Distancia</p>
                  <p className="text-lg font-semibold">{race.distance_km} km</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Categoría</p>
                  <p className="text-lg font-semibold">{race.category}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Género</p>
                  <p className="text-lg font-semibold">
                    {race.gender?.toLowerCase() === "m"
                      ? "Masculino"
                      : race.gender?.toLowerCase() === "f"
                      ? "Femenino"
                      : "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Información de Inscripción
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Precio de inscripción:
                    </span>
                    <span className="font-semibold">{race.entry_fee}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plazas totales:</span>
                    <span className="font-semibold">
                      {race.available_slots}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span
                      className={`font-semibold capitalize ${
                        race.available_slots === 0 ? "text-red-600" : ""
                      }`}
                    >
                      {race.available_slots === 0 ? "cerrado" : race.status}
                    </span>
                  </div>
                </div>

                {renderActionButton()}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Ubicación
                </h3>
                <p className="text-gray-600 mb-4">{race.location}</p>
                <RaceMap coordinates={race.coordinates} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderResultsTable()}
    </div>
  );
}

export default RaceDetail;
