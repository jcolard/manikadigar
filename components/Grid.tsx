import React from 'react';
import { Person } from '../types/game';
import { TRAITS } from '../lib/constants';

interface GridProps {
  grid: (Person | null)[];
  selectedIdx: number | null;
  onPersonClick: (idx: number) => void;
  // Options futures pour le mode IA ou CRM
  crmMode?: boolean; 
  refuseMode?: boolean;
}

export const Grid: React.FC<GridProps> = ({ 
  grid, 
  selectedIdx, 
  onPersonClick, 
  crmMode = false, 
  refuseMode = false 
}) => {
  return (
    <div className={`people-grid ${refuseMode ? 'refuse-mode-active' : ''}`}>
      {grid.map((person, idx) => {
        const isSelected = selectedIdx === idx;
        const isEmpty = !person;

        return (
          <div 
            key={person?.id || `empty-${idx}`} 
            className={`grid-cell ${isEmpty ? 'empty' : ''} ${crmMode ? 'crm-mode' : ''}`}
            onClick={() => !isEmpty && onPersonClick(idx)}
          >
            {person && (
              <div className={`person 
                ${isSelected ? 'selected' : ''} 
                ${person.coupDeCoeur && !person.mecene ? 'coup-de-coeur' : ''}
                ${person.joker ? 'joker' : ''}
                ${person.mecene ? 'grand-mecene' : ''}
              `}>
                
                {/* Badges spéciaux */}
                {person.joker && <span className="joker-star">⭐</span>}
                {person.mecene && <span className="mecene-badge">💎</span>}
                {person.coupDeCoeur && !person.mecene && <span className="coup-de-coeur-badge">💖</span>}

                <span className="person-face">{person.face}</span>
                <div className="person-name">{person.name}</div>

                {/* Traits / Offre & Besoin */}
                <div className="person-traits">
                  {person.joker ? (
                    <div className="trait-badge offer" style={{ borderColor: 'var(--gold-dark)' }} title="Match parfait">⭐</div>
                  ) : person.mecene ? (
                    <div className="trait-badge offer" style={{ borderColor: '#B8720A', background: 'rgba(184,114,10,0.1)' }} title="Grand Mécène">💎</div>
                  ) : (
                    <>
                      <div className="trait-badge offer">{TRAITS[person.offer].icon}</div>
                      <span className="trait-arrow">›</span>
                      <div className="trait-badge need">{TRAITS[person.need].icon}</div>
                    </>
                  )}
                </div>

                {/* Mode CRM */}
                {crmMode && !person.joker && !person.mecene && (
                  <div className="crm-overlay">
                    <span className="crm-tag">{TRAITS[person.offer].icon}→{TRAITS[person.need].icon}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
