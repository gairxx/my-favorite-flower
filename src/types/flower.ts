export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export type BotanicalArchetype =
  | 'camellia'
  | 'chrysanthemum'
  | 'hellebore'
  | 'rose'
  | 'iris'
  | 'poppy'
  | 'narcissus'
  | 'lotus'
  | 'lavender'
  | 'violet'
  | 'peony'
  | 'wisteria'
  | 'marigold'
  | 'snowdrop'
  | 'lily'
  | 'bluebell';

export interface BotanicalPalette {
  primary: string;
  secondary: string;
  center: string;
  foliage: string;
  wash: string;
}

export interface FlowerSpecimen {
  id: string;
  plateNumber: string;
  accessionCode: string;
  commonName: string;
  latinName: string;
  family: string;
  season: Season;
  bloomWindow: string;
  nativeOrigin: string;
  archetype: BotanicalArchetype;
  palette: BotanicalPalette;
  primaryVirtues: [string, string, string];
  shortEssence: string;
  epigraph: {
    quote: string;
    author: string;
  };
  poeticEssay: [string, string, string];
  prosePoem: string[];
  floriography: {
    victorian: string;
    eastern: string;
    mythic: string;
  };
  contemplationPrompt: string;
  companionIds: [string, string];
}

export interface SavedFolioEntry {
  flowerId: string;
  savedAt: string;
  note: string;
}
