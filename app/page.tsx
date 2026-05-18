'use client';

import React, { useEffect } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import { Dashboard } from '../components/Dashboard';
import { Grid } from '../components/Grid'; // À créer
import { HouseArea } from '../components/HouseArea'; // À créer

export default function GamePage() {
  const { state, buyAsso, handlePersonClick } = useGameEngine();

  // Permet d'initialiser l'AudioContext au premier clic global
  useEffect(() => {
    const initAudio = () => {
      // Ta logique initAudio() ici
    };
    document.body.addEventListener('click', initAudio, { once: true });
  }, []);

  return (
    <div className="game">
      {/* Ticker d'actualités */}
      <div className="news-ticker">
        <div className="news-ticker-label">⚡ ACTUS</div>
        <div className="news-ticker-content">
          <div className="news-ticker-track">Lien pour l'autre lance ses 1ers ateliers...</div>
        </div>
      </div>

      {/* Tableau de bord */}
      <Dashboard 
        state={state} 
        onBuyAsso={buyAsso} 
        onBuyHouse={() => console.log('Buy house')} 
      />

      {/* Grille des profils */}
      <section className="gallery">
        <div className="gallery-header">
          <div className="gallery-info">
            <span>Profils : <strong>{state.grid.filter(p => p !== null).length}</strong></span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
              {state.score > 0 ? `🏡 ${state.score}` : ''}
            </span>
          </div>
        </div>
        
        {/* Placeholder pour ton composant Grid */}
        <div className="people-grid">
          {state.grid.map((person, idx) => (
            <div 
              key={person?.id || idx} 
              className={`grid-cell ${!person ? 'empty' : ''}`}
              onClick={() => person && handlePersonClick(idx)}
            >
              {person && (
                <div className={`person ${state.selectedIdx === idx ? 'selected' : ''}`}>
                  <span className="person-face">{person.face}</span>
                  <div className="person-name">{person.name}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Zone des maisons */}
      <section className="houses-area">
        {state.houses.length === 0 ? (
          <div className="houses-empty-msg">Achète des logements via "Bailleur Solidaire" 🏠</div>
        ) : (
          state.houses.map((h, i) => (
            <div key={i} className={`house ${h.usesLeft === 2 ? 'used-twice' : ''}`}>
              🏠
            </div>
          ))
        )}
      </section>
    </div>
  );
}
