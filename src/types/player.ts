export enum Position {
  Forward = "Forward",
  Midfielder = "Midfielder",
  Defender = "Defender",
  Goalkeeper = "Goalkeeper",
}

export type PlayerAttributes = {
  Pace: number; // Measures how fast a player runs, split into acceleration and sprint speed.
  Shooting: number; // Determines accuracy and power when taking shots at the goal.
  Passing: number; // Controls how well and accurately a player passes the ball.
  Dribbling: number; // Shows agility, balance, and ball control in tight spaces.
  Defending: number; // Affects tackling success and defensive awareness.
  Physical: number; // Measures jumping, stamina, strength, and aggression.
};

export type Player = {
  id: string;
  name: string;
  positionPreference: Position;
  attributes: PlayerAttributes;
};
