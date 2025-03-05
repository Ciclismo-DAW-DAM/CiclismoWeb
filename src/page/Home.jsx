import React, { useCallback, useRef } from "react";
import { useRace } from "../context/RaceContext";
import RaceCard from "../components/RaceCard";
import Spinner from "../components/Spinner";

function Home() {
  const { races, loading, hasMore, loadMore } = useRace();
  const observer = useRef();

  const lastRaceElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const currentDate = new Date();
  const upcomingRaces = races.filter((race) => {
    const raceDate = new Date(race.date);
    return raceDate >= currentDate;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Carreras Disponibles
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {upcomingRaces.map((race, index) => (
          <div
            key={race.id}
            ref={index === upcomingRaces.length - 1 ? lastRaceElementRef : null}
          >
            <RaceCard race={race} />
          </div>
        ))}
      </div>
      {loading && <Spinner />}
    </div>
  );
}

export default Home;
