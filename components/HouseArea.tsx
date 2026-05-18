import React from 'react';
import { House } from '../types/game';

interface HouseAreaProps {
  houses: House[];
}

export const HouseArea: React.FC<HouseAreaProps> = ({ houses }) => {
  // Petit hook utilitaire pour choisir une icône au hasard lors du rendu
  const getHouseIcon = () => {
    const icons = ['🏠', '🏡', '🏢'];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  return (
    <section className="houses-area" id="houses-grid">
      {houses.length === 0 ? (
        <div className="houses-empty-msg">Achète des logements via "Bailleur Solidaire" 🏠</div>
      ) : (
        houses.map((house, idx) => (
          <div 
            key={idx} 
            className={`house ${house.usesLeft === 2 ? 'used-twice' : ''}`}
          >
            {getHouseIcon()}
          </div>
        ))
      )}
    </section>
  );
};
