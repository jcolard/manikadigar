import { useState, useCallback, useEffect } from 'react';
import { GameState, Person } from '../types/game';
import { NAMES, PROFILS } from '../lib/constants';

const INITIAL_STATE: GameState = {
  gridSize: 12,
  extraRows: 0,
  grid: Array(12).fill(null),
  houses: [{ usesLeft: 1 }, { usesLeft: 1 }], // Démarrage avec 2 maisons
  selectedIdx: null,
  score: 0,
  level: 1,
  visibility: 12,
  maxHouses: 8,
  combo: 0,
};

export const useGameEngine = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  // Fonction utilitaire pour générer une personne (à compléter avec ta logique de probabilités)
  const generatePerson = useCallback((): Person => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      face: '🧑',
      type: 'creatif',
      label: 'Créatif',
      offer: 'creativite',
      need: 'reseau',
      joker: false,
      mecene: false,
      coupDeCoeur: false,
    };
  }, []);

  const buyAsso = useCallback(() => {
    setState((prev) => {
      if (prev.visibility < 5) return prev; // Coût simplifié
      
      const newGrid = [...prev.grid];
      let spawned = 0;
      
      for (let i = 0; i < newGrid.length; i++) {
        if (newGrid[i] === null && spawned < 3) {
          newGrid[i] = generatePerson();
          spawned++;
        }
      }
      
      return {
        ...prev,
        visibility: prev.visibility - 5,
        grid: newGrid
      };
    });
  }, [generatePerson]);

  const handlePersonClick = useCallback((idx: number) => {
    setState((prev) => {
      // Logique de sélection et de match à insérer ici
      if (prev.selectedIdx === null) {
        return { ...prev, selectedIdx: idx };
      }
      
      if (prev.selectedIdx === idx) {
        return { ...prev, selectedIdx: null }; // Désélection
      }

      // Simulation d'un match (à remplacer par ta fonction attemptMatch)
      const newGrid = [...prev.grid];
      newGrid[prev.selectedIdx] = null;
      newGrid[idx] = null;

      const newHouses = [...prev.houses];
      newHouses.shift(); // Consomme une maison

      return {
        ...prev,
        grid: newGrid,
        houses: newHouses,
        score: prev.score + 1,
        visibility: prev.visibility + 5,
        selectedIdx: null
      };
    });
  }, []);

  // La boucle de jeu pour les revenus passifs (remplace ton requestAnimationFrame)
  useEffect(() => {
    const interval = setInterval(() => {
      // Logique passive : loyers, dotations, cooldowns auto-bailleurs
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return { state, buyAsso, handlePersonClick };
};
