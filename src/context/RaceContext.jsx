import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export const RaceContext = createContext();

export const RaceProvider = ({ children }) => {
  const [races, setRaces] = useState(() => {
    const savedRaces = localStorage.getItem("races");
    return savedRaces ? JSON.parse(savedRaces) : [];
  });
  
  // Initialize isParticipation with localStorage data
  const [isParticipation, setIsParticipation] = useState(() => {
    const savedParticipations = localStorage.getItem("participations");
    return savedParticipations ? JSON.parse(savedParticipations) : [];
  });
  
  const fetchRaces = async () => {
    try {
      const response = await fetch('http://192.168.40.87:5000/cycling');
      if (!response.ok) {
        throw new Error('Error al cargar las carreras');
      }
      const data = await response.json();
      setRaces(data);
    } catch (error) {
      console.error('Error fetching races:', error);
      toast.error('Error al cargar las carreras', {
        style: {
          background: "red",
          color: "white",
          border: "2px solid red",
        },
      });
    }
  };
  // Fetch races when component mounts
  useEffect(() => {
    fetchRaces();
  }, []);
  // Add this useEffect to save participations to localStorage
  useEffect(() => {
    localStorage.setItem("participations", JSON.stringify(isParticipation));
  }, [isParticipation]);
  const addToParticipe = (raceToAdd) => {
    if (isParticipation.some((race) => race.id === raceToAdd.id)) {
      toast.error(`${raceToAdd.name} ya estas participando`, {
        style: {
          background: "red",
          color: "white",
          border: "2px solid red",
        },
      });
      return;
    }
    setIsParticipation((prevParticipation) => [...prevParticipation, raceToAdd]);
    
    toast.success(`Participaras en ${raceToAdd.name}`, {
      style: {
        background: "#fee2e2",
        color: "black",
        border: "2px solid red",
      },
      icon: "👌",
    });
  };
  const removeToParticipe = (raceId) => {
    const raceToRemove = isParticipation.find(race => race.id === raceId);
    
    setIsParticipation((prevParticipation) =>
      prevParticipation.filter((race) => race.id !== raceId)
    );
    
    if (raceToRemove) {
      toast.success(`Ya no participas en ${raceToRemove.name}`, {
        style: {
          background: "#fee2e2",
          color: "white",
          border: "2px solid red",
        },
        icon: "🗑️",
      });
    }
  };
  return (
    <RaceContext.Provider value={{ 
      races, 
      addToParticipe, 
      removeToParticipe,
      fetchRaces,
      isParticipation // Add this to make participations available
    }}>
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
}