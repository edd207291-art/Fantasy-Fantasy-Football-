export enum Position {
  Goalkeeper = "Goalkeeper",
  Defender = "Defender",
  Midfielder = "Midfielder",
  Forward = "Forward",
}

export type Player = {
  id: string;
  name: string;
  rating: number;
  position: Position;
};
