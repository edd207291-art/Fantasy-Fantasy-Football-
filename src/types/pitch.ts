export type PitchCoordinates = {
  x: number;
  y: number;
};

export type PitchZone = {
  coordinates: PitchCoordinates;
  playerId?: string;
  homeGoalMouth: boolean;
  awayGoalMouth: boolean;
  inHomeGoalArea: boolean;
  inAwayGoalArea: boolean;
  inHomePenaltyArea: boolean;
  inAwayPenaltyArea: boolean;
  inHomeHalf: boolean;
  inAwayHalf: boolean;
  inCenterCircle: boolean;
  homePenaltySpot: boolean;
  awayPenaltySpot: boolean;
  containsBall?: boolean;
};

export type Pitch = PitchZone[][];
