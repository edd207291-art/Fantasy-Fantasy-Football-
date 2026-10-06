export const LINEUP_FORMATIONS = {
  "4-4-2": { goalkeeper: 1, defenders: 4, midfielders: 4, forwards: 2 },
  "4-3-3": { goalkeeper: 1, defenders: 4, midfielders: 3, forwards: 3 },
  "3-4-3": { goalkeeper: 1, defenders: 3, midfielders: 4, forwards: 3 },
  "3-5-2": { goalkeeper: 1, defenders: 3, midfielders: 5, forwards: 2 },
} as const;

export type LineupFormation = keyof typeof LINEUP_FORMATIONS;

export type ManagerLineup = {
  formation: LineupFormation;
  goalkeeperId: string;
  defendersIds: string[];
  midfieldersIds: string[];
  forwardsIds: string[];
};
