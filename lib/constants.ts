import { Trait } from '../types/game';

export const NAMES = ['Léa','Tom','Sami','Inès','Nora','Yann','Mei','Jules','Aïsha','Léo','Maya'];
export const JOKER_NAMES = ['Aria', 'Sage', 'Robin', 'Charlie', 'Phénix'];
export const MECENE_NAMES = ['Fondation Martin', 'Groupe Leclercq', 'Mécène Anonyme'];

export const TRAITS: Record<Trait, { icon: string; label: string }> = {
  logement:      { icon: '🏠', label: 'Logement' },
  energie:       { icon: '💪', label: 'Énergie' },
  calme:         { icon: '🧘', label: 'Calme' },
  numerique:     { icon: '💻', label: 'Numérique' },
  nature:        { icon: '🌳', label: 'Nature' },
  creativite:    { icon: '🎨', label: 'Créativité' },
  reseau:        { icon: '🤝', label: 'Réseau' },
  bienveillance: { icon: '💗', label: 'Écoute' },
  joker:         { icon: '⭐', label: 'Joker' }
};

export const LEVELS = [3, 7, 12, 18, 25, 32, 40];
