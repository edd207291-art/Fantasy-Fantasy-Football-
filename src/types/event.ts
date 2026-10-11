export enum EventType {
  SCORE_GOAL,
}

export type Event = {
  playerId?: string;
  type: EventType;
  matchId?: string;
  time?: string;
};
