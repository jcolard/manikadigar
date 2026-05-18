import React from 'react';
import { NEWS_BY_TIER } from '../lib/constants';

interface NewsTickerProps {
  visibility: number;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ visibility }) => {
  const tiers = [150, 80, 40, 15, 0];
  const currentTier = tiers.find((t) => visibility >= t) || 0;
  
  // Récupère les actus du palier actuel ou par défaut le palier 0
  const news = NEWS_BY_TIER[currentTier as keyof typeof NEWS_BY_TIER] || NEWS_BY_TIER[0];

  return (
    <div className="news-ticker">
      <div className="news-ticker-label">⚡ ACTUS</div>
      <div className="news-ticker-content">
        <div className="news-ticker-track">
          {/* On duplique le tableau de news pour assurer un effet de défilement fluide sans coupure */}
          {[...news, ...news].map((item, idx) => (
            <span key={idx} className="news-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
