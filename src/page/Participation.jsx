import React from 'react';
import { useRace } from '../context/RaceContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Participation = () => {
  const { isParticipation, removeToParticipe } = useRace();

  const handleRemoveParticipation = async (raceId) => {
    try {
      await removeToParticipe(raceId);
    } catch (error) {
      toast.error('Error al eliminar la participación');
    }
  };

  if (isParticipation.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No tienes inscripciones activas</h2>
          <Link to="/home" className="text-blue-600 hover:text-blue-800">
            Ver carreras disponibles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Inscripciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isParticipation.map((race) => (
          <div key={race.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <img
                src={race.image}
                alt={race.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-lg">
                {race.distance_km} km
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{race.name}</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Fecha:</span> {race.date}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Ubicación:</span> {race.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Categoría:</span> {race.category}
                </p>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Link 
                  to={`/race/${race.id}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Ver detalles
                </Link>
                <button
                  onClick={() => handleRemoveParticipation(race.id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participation;