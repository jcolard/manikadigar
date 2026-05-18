# Directives du projet : Lien pour l'autre (Next.js / React / TS)

## Stack Technique
- Framework : Next.js 14+ (App Router)
- UI : React 18+ (Composants fonctionnels & Hooks)
- Langage : TypeScript (Mode Strict)
- Styles : CSS global (`app/globals.css`) basé sur les variables root d'origine
- Capacités : Support PWA (Manifest & Service Worker)

## Architecture des dossiers
```text
├── app/
│   ├── globals.css      # Design system, animations, variables couleur d'origine
│   ├── layout.tsx       # Configuration HTML globale, Viewport et Métadonnées
│   └── page.tsx         # Point d'entrée du jeu (Orchestrateur)
├── components/
│   ├── Dashboard.tsx    # En-tête, impact, combo, et actions principales (Asso / Bailleur)
│   ├── Grid.tsx         # Grille 3x4+ dynamique, rendu des cartes profils & overlays CRM
│   ├── HouseArea.tsx    # Zone d'affichage des logements disponibles et occupés
│   └── NewsTicker.tsx   # Bandeau de défilement infini des actualités associatives
├── hooks/
│   └── useGameEngine.ts # Machine à états (State engine), gestion des ticks et de la logique métier
├── lib/
│   ├── audio.ts         # Encapsulation sécurisée de l'AudioContext pour le SSR
│   └── constants.ts     # Données statiques (Noms, Profils, Paliers de niveaux, News)
├── public/
│   ├── manifest.json    # Configuration PWA pour l'installation sur mobile/desktop
│   └── logo.png         # Logo et icône de l'application
└── CLAUDE.md            # Ce fichier
