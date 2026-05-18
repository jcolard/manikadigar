import React from 'react';
import { GameState } from '../types/game';

interface DashboardProps {
  state: GameState;
  onBuyAsso: () => void;
  onBuyHouse: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onBuyAsso, onBuyHouse }) => {
  return (
    <section className="dashboard">
      <div className="dash-header">
        <div className="brand-logo-fallback">Lien pour l'autre</div>
        <div className="header-actions">
          {state.combo >= 2 && <div className="combo-badge active">🔥 {state.combo}</div>}
        </div>
      </div>

      <div className="level-container">
        <div className="level-header">
          <span>Niveau {state.level}</span>
          <span className="vis">{state.visibility} ✨ Impact</span>
        </div>
        {/* Barre de progression ici */}
      </div>

      <div className="action-buttons">
        <button className="action-btn" onClick={onBuyAsso} disabled={state.visibility < 5}>
          <div className="action-icon">🤝</div>
          <div className="action-text">
            <span className="action-title">Asso Partenaire</span>
            <span className="action-desc">+3 profils</span>
          </div>
          <div className="action-cost">5 ✨</div>
        </button>

        <button className="action-btn" onClick={onBuyHouse} disabled={state.visibility < 4}>
          <div className="action-icon">🏠</div>
          <div className="action-text">
            <span className="action-title">Bailleur Solidaire</span>
            <span className="action-desc">+1 logement</span>
          </div>
          <div className="action-cost">4 ✨</div>
        </button>
      </div>
    </section>
  );
};
