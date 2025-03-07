import React from "react";
import { Link } from "react-router-dom";

function RaceCard({ race }) {
  return (
    <Link to={`/race/${race?.id}`} className="block">
      <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
        <div className="relative">
          <img
            src={race?.image}
            alt={race?.name}
            className="w-full h-48 object-cover rounded-t-xl"
            loading="lazy"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-sky-900 px-3 py-1 rounded-full font-semibold text-sm shadow-lg">
            {Number(race?.distance_km)} km
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-sky-900 mb-2 line-clamp-2">
            {race?.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {new Date(race?.date).toLocaleDateString()}
            </p>
            <span className="text-sky-600 font-medium hover:text-sky-800">
              Ver detalles →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default RaceCard;
