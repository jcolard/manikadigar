export type Trait = 'logement' | 'energie' | 'calme' | 'numerique' | 'nature' | 'creativite' | 'reseau' | 'bienveillance' | 'joker';

export interface Person {
  id: string;
  name: string;
  face: string;
  type: string;
  label: string;
  offer: Trait;
  need: Trait;
  joker: boolean;
  mecene: boolean;
  coupDeCoeur: boolean;
}

export interface House {
  usesLeft: number;
}

export interface GameState {
  gridSize: number;
  extraRows: number;
  grid: (Person | null)[];
  houses: House[];
  selectedIdx: number | null;
  score: number;
  level: number;
  visibility: number;
  maxHouses: number;
  combo: number;
  // Ajoute ici le reste de ton état (upgrades, autoBailleur, etc.)
}
