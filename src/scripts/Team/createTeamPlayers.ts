import { PITCH_LENGTH, PITCH_WIDTH } from "@/scripts/Match/Pitch/createPitch";
import type { Player } from "@/types/player";
import type { PlayerPosition } from "@/types/team";

const GOALKEEPER_ROW_PERCENT = 4;
const INITIAL_DEFENDERS_ROW_PERCENT = 15;
const INITIAL_MIDFIELDERS_ROW_PERCENT = 27;
const INITIAL_FORWARDS_ROW_PERCENT = 40;
const RESTING_DEFENDERS_ROW_PERCENT = 25;
const RESTING_MIDFIELDERS_ROW_PERCENT = 50;
const RESTING_FORWARDS_ROW_PERCENT = 75;

const createPlayerPositions = (
  players: Player[],
  initialRowPercent: number,
  restingRowPercent: number,
): PlayerPosition[] => {
  const initialY = Math.round((PITCH_LENGTH * initialRowPercent) / 100);
  const restingY = Math.round((PITCH_LENGTH * restingRowPercent) / 100);

  return players.map((player, index) => ({
    player,
    initialCoordinates: {
      x: Math.round(((index + 1) * PITCH_WIDTH) / (players.length + 1)),
      y: initialY,
    },
    restingCoordinates: {
      x: Math.round(((index + 1) * PITCH_WIDTH) / (players.length + 1)),
      y: restingY,
    },
  }));
};

export const createTeamPlayers = ({
  goalkeeper,
  defenders,
  midfielders,
  forwards,
}: {
  goalkeeper: Player;
  defenders: Player[];
  midfielders: Player[];
  forwards: Player[];
}) => ({
  Goalkeeper: {
    player: goalkeeper,
    initialCoordinates: {
      x: Math.floor(PITCH_WIDTH / 2),
      y: Math.round((PITCH_LENGTH * GOALKEEPER_ROW_PERCENT) / 100),
    },
    restingCoordinates: {
      x: Math.floor(PITCH_WIDTH / 2),
      y: Math.round((PITCH_LENGTH * GOALKEEPER_ROW_PERCENT) / 100),
    },
  },
  Defenders: createPlayerPositions(
    defenders,
    INITIAL_DEFENDERS_ROW_PERCENT,
    RESTING_DEFENDERS_ROW_PERCENT,
  ),
  Midfielders: createPlayerPositions(
    midfielders,
    INITIAL_MIDFIELDERS_ROW_PERCENT,
    RESTING_MIDFIELDERS_ROW_PERCENT,
  ),
  Forwards: createPlayerPositions(
    forwards,
    INITIAL_FORWARDS_ROW_PERCENT,
    RESTING_FORWARDS_ROW_PERCENT,
  ),
});
