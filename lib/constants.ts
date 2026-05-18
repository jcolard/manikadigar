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
export const NEWS_BY_TIER: Record<number, string[]> = {
  0: [
    "Lien pour l'autre lance ses 1ers ateliers de mise en relation",
    "L'isolement touche 1 senior sur 4 en France",
    "Et si la solution au mal-logement passait par l'entraide ?",
    "200 000 jeunes ont besoin d'un toit chaque année"
  ],
  15: [
    "🎉 Première colocation intergénérationnelle inaugurée !",
    "Sylvie, 72 ans, partage son toit avec Yanis, étudiant",
    "Témoignage : « Vivre ensemble, c'est se réinventer »"
  ],
  40: [
    "🏡 50 foyers inclusifs accompagnés par l'association",
    "La presse locale salue le modèle Lien pour l'autre",
    "Une charte de vie partagée co-rédigée par les colocataires"
  ],
  80: [
    "💰 Subvention régionale décrochée pour étendre le programme",
    "Lien pour l'autre étend son réseau à 5 nouvelles villes",
    "100 mises en relation réussies depuis le lancement"
  ],
  150: [
    "🌟 Lauréat de l'appel à projets « Habitat pour des liens »",
    "Le modèle Lien pour l'autre essaime dans toute la France",
    "Tu fais partie de cette dynamique : merci !"
  ]
};
