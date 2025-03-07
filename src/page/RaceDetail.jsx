import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRace } from "../context/RaceContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import RaceMap from "../components/RaceMap";
import Spinner from "../components/Spinner";

function RaceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { races, addToParticipe, removeToParticipe, isParticipation} =
    useRace();
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

  const renderActionButton = () => {
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
          disabled={race.status !== "open"}
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-300 hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <ArrowLeftIcon className="h-5 w-5" /> Volver
      </button>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-72">
          <img
            src={race.image}
            alt={race.name}
            className="w-full h-full object-cover"
          />
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
                    <span className="text-gray-600">Plazas disponibles:</span>
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
                {/* <RaceMap coordinates={race.coordinates} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RaceDetail;
