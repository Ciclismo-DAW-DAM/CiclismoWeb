import React from 'react';
import { Link } from 'react-router-dom';

function RaceCard({ race }) {
  return (
    <Link to={`/race/${race?.id}`} className="group">
      <article className="card transform transition-transform duration-200 group-hover:scale-105">
        <div className="relative aspect-[2/3]">
          <img
            src={race?.image}
            alt={race?.name}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-lg">
            {Number(race?.distance_km).toFixed(1)} km
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-sky-900 group-hover:text-gray-700">
            {race.name}
          </h3>
          <p className="text-sm font-bold text-gray-800 mt-1">
            {race.date}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default RaceCard;
