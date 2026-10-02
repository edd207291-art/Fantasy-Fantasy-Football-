import { generateTeam } from "@/scripts/Team/generateTeam";
import { getPlayersInClub } from "@/store/clubsSlice";
import { Pitch } from "@/types/pitch";
import { createPitch, PITCH_LENGTH, PITCH_WIDTH } from "./createPitch";

const placeTeamOnPitch = (
  pitch: Pitch,
  teamPlayers: ReturnType<typeof generateTeam>["teamPlayers"],
  isHomeTeam: boolean,
) => {
  const goalkeepersRow = isHomeTeam ? 2 : PITCH_LENGTH - 3;
  const defendersRow = isHomeTeam ? 10 : PITCH_LENGTH - 11;
  const midfieldersRow = isHomeTeam ? 21 : PITCH_LENGTH - 22;
  const forwardsRow = isHomeTeam ? 30 : PITCH_LENGTH - 31;

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

export const setUpPitchForMatch = (
  homeClubPlayers: ReturnType<typeof getPlayersInClub>,
  awayClubPlayers: ReturnType<typeof getPlayersInClub>,
) => {
  const pitch = createPitch();
  const homeTeam = generateTeam(homeClubPlayers);
  const awayTeam = generateTeam(awayClubPlayers);

  placeTeamOnPitch(pitch, homeTeam.teamPlayers, true);
  placeTeamOnPitch(pitch, awayTeam.teamPlayers, false);

  const centerX = Math.floor(PITCH_WIDTH / 2);
  const centerY = Math.floor(PITCH_LENGTH / 2);
  pitch[centerY][centerX].containsBall = true;

  return { pitch };
};
