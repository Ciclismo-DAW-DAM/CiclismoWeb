import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRace } from '../context/RaceContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

function RaceDetail() {
  const { id } = useParams();
  const { races, addToParticipe, removeToParticipe, isParticipation } = useRace();
  const { isAuthenticated } = useAuth();
  const [race, setRace] = useState(null);

  useEffect(() => {
    const currentRace = races.find(r => r.id === id);
    setRace(currentRace);
  }, [id, races]);

  if (!race) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Cargando...</div>
      </div>
    );
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
      toast.error('Error al procesar la solicitud');
    }
  };

  const renderActionButton = () => {
    if (!isAuthenticated) {
      return (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">Para inscribirte en esta carrera necesitas iniciar sesión</p>
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
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={race.status !== 'open'}
        >
          {isParticipating ? 'Desinscribirse' : 'Inscribirse'}
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={race.image}
            alt={race.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h1 className="text-4xl font-bold text-white mb-2">{race.name}</h1>
            <p className="text-xl text-gray-200">{race.location}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Detalles de la Carrera</h2>
                <p className="text-gray-600">{race.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="text-lg font-semibold">{race.date}</p>
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
                  <p className="text-sm text-gray-500">Tiempo Máximo</p>
                  <p className="text-lg font-semibold">{race.max_time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Información de Inscripción</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio de inscripción:</span>
                    <span className="font-semibold">{race.entry_fee}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plazas disponibles:</span>
                    <span className="font-semibold">{race.available_slots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-semibold capitalize ${race.available_slots === 0 ? 'text-red-600' : ''}`}>
                      {race.available_slots === 0 ? 'cerrado' : race.status}
                    </span>
                  </div>
                </div>

                {renderActionButton()}

              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ubicación</h3>
                <p className="text-gray-600 mb-2">{race.location}</p>
                <div className="text-sm text-gray-500">
                  <p>Lat: {race.coordinates.lat}</p>
                  <p>Lng: {race.coordinates.lng}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RaceDetail;