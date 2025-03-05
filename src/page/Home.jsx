import React from 'react';
import { useRace } from '../context/RaceContext';
import RaceCard from '../components/RaceCard';

function Home() {
  const { races } = useRace();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Carreras Disponibles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {races.map((race) => (
          <RaceCard key={race.id} race={race} />
        ))}
      </div>
    </div>
  );
}

export default Home;