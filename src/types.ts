export type Zone = 'forest' | 'fisch' | 'prison' | 'brookhaven' | 'spot' | 'fnaf';

export interface GameState {
  activeZone: Zone | null;
  isPlaying: boolean;
  score: number;
  selectedSkin?: string;
  selectedTrail?: string;
  selectedPet?: string;
}
