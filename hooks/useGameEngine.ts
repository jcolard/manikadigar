import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Person, House } from '../types/game';
import { NAMES, JOKER_NAMES, MECENE_NAMES, PROFILS, LEVELS, TRAITS } from '../lib/constants';
import { playSfx } from '../lib/audio';

// --- FONCTIONS UTILITAIRES PURES ---
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const affinityScore = (p1: Person, p2: Person): number => {
  if (p1.joker || p2.joker || p1.mecene || p2.mecene) return 4;
  let score = 0;
  if (p1.offer === p2.need) score += 2;
  if (p2.offer === p1.need) score += 2;
  return score;
};

// État initial basé sur ton code vanilla
const INITIAL_STATE: GameState = {
  gridSize: 12,
  extraRows: 0,
  grid: Array(12).fill(null),
  houses: [{ usesLeft: 1 }, { usesLeft: 1 }],
  selectedIdx: null,
  score: 0,
  level: 1,
  visibility: 12,
  maxHouses: 8,
  ended: false,
  combo: 0,
  lastMatchTime: 0,
  unlockedFeatures: {
    refuse: false, sort: false, comboBoost: false, campaign: false,
    autoAsso: false, autoBailleur: false, aiMatch: false, crm: false,
  },
  refuseMode: false,
  aiMatchMode: false,
  autoAssoBought: 0,
  autoBailleurBought: 0,
  campaign: null,
  upgrades: {
    newsletter: 0, communityManager: 0, pagePress: 0, coordinateur: 0,
    formationMediation: 0, charteVie: 0, celluleEcoute: 0, crm: 0,
    algoIA: 0, diagnosticTerritorial: 0, bailSolidaire: 0, conventionnement: 0,
    locAvantages: 0, logementTampon: 0, fondsDotation: 0, loyerReverse: 0,
  },
  dotationPurchased: 0,
  passiveRate: 0,
  quests: [],
  questStats: {
    strong_matches: 0, weak_matches: 0, max_combo: 0, joker_matches: 0,
    coeur_matches: 0, asso_buys: 0, foyers: 0, mecene_matches: 0,
  },
  stats: {
    strongMatches: 0, weakMatches: 0, jokerMatches: 0, coeurMatches: 0,
    meceneMatches: 0, campaignVis: 0, coinsCollected: 0, maxCombo: 0,
  },
  nextJackpotAt: 5,
};

export const useGameEngine = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  // Utilisation de ref pour la boucle de jeu afin d'éviter les re-rendus infinis
  const lastPassiveTick = useRef(Date.now());
  const lastDotationTick = useRef(Date.now());

  // --- GÉNÉRATION DE PROFILS ---
  const generatePerson = useCallback((currentState: GameState): Person => {
    const isMecene = currentState.unlockedFeatures.campaign && Math.random() < 0.03;
    const isJoker = currentState.level >= 3 && Math.random() < (currentState.level < 5 ? 0.04 : 0.07);
    const isCoup = Math.random() < 0.10; // + upgrades.sourcing si ajouté plus tard

    if (isMecene) {
      return { id: Math.random().toString(36).substr(2,9), name: pick(MECENE_NAMES), face: '💎', type: 'grand-mecene', label: 'Grand Mécène', offer: 'joker', need: 'joker', joker: false, mecene: true, coupDeCoeur: false };
    }
    if (isJoker) {
      return { id: Math.random().toString(36).substr(2,9), name: pick(JOKER_NAMES), face: '🤗', type: 'joker', label: 'Polyvalent ⭐', offer: 'joker', need: 'joker', joker: true, mecene: false, coupDeCoeur: false };
    }

    let profil = PROFILS[Math.floor(Math.random() * PROFILS.length)];
    return {
      id: Math.random().toString(36).substr(2,9),
      name: pick(NAMES),
      face: pick(profil.faces),
      type: profil.type,
      label: profil.label,
      offer: profil.offer,
      need: profil.need,
      joker: false,
      mecene: false,
      coupDeCoeur: isCoup
    };
  }, []);

  // --- ACTIONS PRINCIPALES ---
  const buyAsso = useCallback(() => {
    setState(prev => {
      if (prev.refuseMode) return prev;
      const cost = Math.max(3, 4 + prev.level - (prev.upgrades.communityManager > 0 ? 1 : 0));
      if (prev.visibility < cost) return prev;
      
      const emptyCount = prev.grid.filter(p => p === null).length;
      if (emptyCount === 0) {
        playSfx('error');
        return prev;
      }

      playSfx('buy');
      const newGrid = [...prev.grid];
      const amountToSpawn = Math.min(3, emptyCount);
      let spawned = 0;

      for (let i = 0; i < newGrid.length; i++) {
        if (newGrid[i] === null && spawned < amountToSpawn) {
          newGrid[i] = generatePerson(prev);
          spawned++;
        }
      }

      return {
        ...prev,
        visibility: prev.visibility - cost,
        grid: newGrid,
        questStats: { ...prev.questStats, asso_buys: prev.questStats.asso_buys + 1 }
      };
    });
  }, [generatePerson]);

  const buyBailleur = useCallback(() => {
    setState(prev => {
      if (prev.refuseMode) return prev;
      const cost = Math.max(2, 3 + prev.level - prev.upgrades.conventionnement);
      if (prev.visibility < cost || prev.houses.length >= prev.maxHouses) {
        playSfx('error');
        return prev;
      }

      playSfx('buy');
      const usesLeft = prev.upgrades.bailSolidaire > 0 && Math.random() < 0.33 ? 2 : 1;
      if (usesLeft === 2) playSfx('unlock');

      return {
        ...prev,
        visibility: prev.visibility - cost,
        houses: [...prev.houses, { usesLeft }]
      };
    });
  }, []);

  // --- LOGIQUE DE CLIC ET DE MATCH ---
  const handlePersonClick = useCallback((idx: number) => {
    setState(prev => {
      if (prev.ended) return prev;

      // MODE REFUS
      if (prev.refuseMode) {
        if (!prev.grid[idx]) return prev;
        if (prev.visibility < 1) {
          playSfx('error');
          return { ...prev, refuseMode: false };
        }
        playSfx('refuse');
        const newGrid = [...prev.grid];
        newGrid[idx] = generatePerson(prev);
        return { ...prev, visibility: prev.visibility - 1, grid: newGrid, refuseMode: false };
      }

      playSfx('click');

      // SÉLECTION
      if (prev.selectedIdx === null) return { ...prev, selectedIdx: idx };
      if (prev.selectedIdx === idx) return { ...prev, selectedIdx: null }; // Désélection

      const p1 = prev.grid[prev.selectedIdx];
      const p2 = prev.grid[idx];
      if (!p1 || !p2) return { ...prev, selectedIdx: null };

      const score = affinityScore(p1, p2);

      // ÉCHEC DU MATCH
      if (score === 0) {
        playSfx('error');
        const breakCombo = prev.combo >= 2 && prev.upgrades.charteVie === 0;
        return { ...prev, selectedIdx: null, combo: breakCombo ? 0 : prev.combo };
      }

      // VÉRIFICATION MAISONS
      if (prev.houses.length === 0) {
        playSfx('error');
        return { ...prev, selectedIdx: null };
      }

      // RÉUSSITE DU MATCH
      const isStrong = score === 4;
      const isCoup = p1.coupDeCoeur || p2.coupDeCoeur;
      const isJoker = p1.joker || p2.joker;
      const isMecene = p1.mecene || p2.mecene;

      let visGain = isStrong ? 5 : 1;
      if (!isStrong && prev.upgrades.coordinateur > 0) visGain += 2;
      if (isStrong && prev.upgrades.formationMediation > 0) visGain += 2;
      if (isCoup) visGain += isStrong ? 5 : 2;
      if (isJoker) visGain += 3;
      if (isMecene) visGain += 40;

      let newCombo = prev.combo;
      if (isStrong) newCombo++;

      if (prev.unlockedFeatures.comboBoost && newCombo >= 5 && isStrong) visGain *= 2;
      else if (newCombo >= 3 && isStrong) visGain += (newCombo - 2);

      // SFX spécifiques
      if (isMecene) playSfx('mecene');
      else if (isJoker) playSfx('joker');
      else if (newCombo >= 5 && isStrong) playSfx('combo');
      else if (isCoup) playSfx('heart');
      else if (isStrong) playSfx('match-strong');
      else playSfx('match-weak');

      // Mise à jour Grille & Maisons
      const newGrid = [...prev.grid];
      newGrid[prev.selectedIdx] = null;
      newGrid[idx] = null;

      const newHouses = [...prev.houses];
      if (newHouses[0].usesLeft === 2) {
        newHouses[0] = { usesLeft: 1 };
      } else {
        newHouses.shift();
      }

      const newScore = prev.score + 1;
      const targetLevel = LEVELS[prev.level - 1] || LEVELS[LEVELS.length - 1];
      let newLevel = prev.level;
      
      if (newScore >= targetLevel && newLevel <= LEVELS.length) {
        newLevel++;
        playSfx('lvlup');
        // Tu pourras brancher ton animation de coffre de niveau ici plus tard
      }

      return {
        ...prev,
        grid: newGrid,
        houses: newHouses,
        score: newScore,
        level: newLevel,
        visibility: prev.visibility + visGain,
        selectedIdx: null,
        combo: newCombo,
        lastMatchTime: Date.now(),
        questStats: { ...prev.questStats, foyers: newScore }
      };
    });
  }, [generatePerson]);

  // --- ACTIONS UI (Boutons Toggle) ---
  const toggleRefuseMode = () => setState(prev => ({ ...prev, refuseMode: !prev.refuseMode, selectedIdx: null }));
  const toggleAiMode = () => setState(prev => ({ ...prev, aiMatchMode: !prev.aiMatchMode }));
  
  const sortGrid = () => {
    setState(prev => {
      playSfx('sort');
      const profiles = prev.grid.filter(p => p !== null) as Person[];
      const traitOrder = ['logement', 'numerique', 'energie', 'calme', 'creativite', 'reseau', 'bienveillance', 'nature'];
      
      profiles.sort((a, b) => {
        if (a.joker && !b.joker) return 1; if (!a.joker && b.joker) return -1;
        if (a.mecene && !b.mecene) return -1; if (!a.mecene && b.mecene) return 1;
        const needA = traitOrder.indexOf(a.need), needB = traitOrder.indexOf(b.need);
        if (needA !== needB) return needA - needB;
        return traitOrder.indexOf(a.offer) - traitOrder.indexOf(b.offer);
      });

      const newGrid = Array(prev.gridSize).fill(null);
      profiles.forEach((p, i) => newGrid[i] = p);

      return { ...prev, grid: newGrid, selectedIdx: null };
    });
  };

  // --- BOUCLE DE JEU (Revenus passifs & Cooldowns) ---
  useEffect(() => {
    const loop = setInterval(() => {
      const now = Date.now();

      setState(prev => {
        let newState = { ...prev };
        let stateChanged = false;

        // Reset Combo
        const timeoutMs = prev.upgrades.celluleEcoute > 0 ? 20000 : 12000;
        if (prev.combo >= 2 && (now - prev.lastMatchTime) > timeoutMs) {
          newState.combo = 0;
          stateChanged = true;
        }

        // Loyer reversé (+0.2 / sec / foyer) appliqué toutes les 5s
        if (prev.upgrades.loyerReverse > 0 && prev.score > 0) {
          if (now - lastPassiveTick.current >= 5000) {
            const gain = Math.floor(prev.score * 0.2 * 5);
            if (gain > 0) {
              newState.visibility += gain;
              stateChanged = true;
            }
            lastPassiveTick.current = now;
          }
        }

        // Fonds de dotation (+1 toutes les 10s par tranche)
        if (prev.dotationPurchased > 0) {
          if (now - lastDotationTick.current >= 10000) {
            newState.visibility += prev.dotationPurchased;
            stateChanged = true;
            lastDotationTick.current = now;
          }
        }

        return stateChanged ? newState : prev;
      });
    }, 1000); // Exécution de la boucle chaque seconde pour la performance React

    return () => clearInterval(loop);
  }, []);

  return {
    state,
    buyAsso,
    buyBailleur,
    handlePersonClick,
    toggleRefuseMode,
    toggleAiMode,
    sortGrid
  };
};
