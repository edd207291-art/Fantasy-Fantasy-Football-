import { generateTeam } from "@/scripts/Team/generateTeam";
import { Pitch } from "@/types/pitch";
import { ITeam } from "@/types/team";
import { createPitch, PITCH_LENGTH, PITCH_WIDTH } from "./createPitch";

const GOALKEEPER_ROW_PERCENT = 4;
const DEFENDERS_ROW_PERCENT = 15;
const MIDFIELDERS_ROW_PERCENT = 27;
const FORWARDS_ROW_PERCENT = 40;

const placeTeamOnPitch = (
  pitch: Pitch,
  teamPlayers: ReturnType<typeof generateTeam>["teamPlayers"],
  isHomeTeam: boolean,
) => {
  const getRowFromOwnGoal = (percentage: number) => {
    const offset = Math.round((PITCH_LENGTH * percentage) / 100);
    return isHomeTeam ? offset : PITCH_LENGTH - 1 - offset;
  };
  const goalkeepersRow = getRowFromOwnGoal(GOALKEEPER_ROW_PERCENT);
  const defendersRow = getRowFromOwnGoal(DEFENDERS_ROW_PERCENT);
  const midfieldersRow = getRowFromOwnGoal(MIDFIELDERS_ROW_PERCENT);
  const forwardsRow = getRowFromOwnGoal(FORWARDS_ROW_PERCENT);

  const placePlayers = (
    players: ReturnType<typeof generateTeam>["teamPlayers"]["Defenders"],
    row: number,
  ) => {
    players.forEach((player, index) => {
      const x = Math.round(((index + 1) * PITCH_WIDTH) / (players.length + 1));
      pitch[row][x].playerId = player.id;
    });
  };

  const goalkeeperX = Math.floor(PITCH_WIDTH / 2);
  pitch[goalkeepersRow][goalkeeperX].playerId = teamPlayers.Goalkeeper.id;
  placePlayers(teamPlayers.Defenders, defendersRow);
  placePlayers(teamPlayers.Midfielders, midfieldersRow);
  placePlayers(teamPlayers.Forwards, forwardsRow);
};

export const setUpPitchForMatch = (homeTeam: ITeam, awayTeam: ITeam) => {
  const pitch = createPitch();

  placeTeamOnPitch(pitch, homeTeam.teamPlayers, true);
  placeTeamOnPitch(pitch, awayTeam.teamPlayers, false);

  const centerX = Math.floor(PITCH_WIDTH / 2);
  const centerY = Math.floor(PITCH_LENGTH / 2);
  pitch[centerY][centerX].containsBall = true;

  return { pitch };
};
