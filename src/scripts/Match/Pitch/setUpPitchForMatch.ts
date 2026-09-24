import { generateTeam } from "@/scripts/Team/generateTeam";
import { getPlayersInClub } from "@/store/clubsSlice";
import { Pitch } from "@/types/pitch";
import { Player } from "@/types/player";
import { createPitch, PITCH_LENGTH, PITCH_WIDTH } from "./createPitch";

const getPitchXPositions = (playerCount: number): number[] => {
  if (playerCount <= 1) {
    return [Math.floor(PITCH_WIDTH / 2)];
  }

  const spacing = Math.floor((PITCH_WIDTH - 8) / (playerCount - 1));

  return Array.from({ length: playerCount }, (_, index) => {
    const x = 4 + index * spacing;
    return Math.min(x, PITCH_WIDTH - 5);
  });
};

const placeTeamOnPitch = (
  pitch: Pitch,
  teamPlayers: ReturnType<typeof generateTeam>["teamPlayers"],
  isHomeTeam: boolean,
) => {
  const goalKeeperY = isHomeTeam ? 1 : PITCH_LENGTH - 2;
  const goalKeeperX = Math.floor(PITCH_WIDTH / 2);

  pitch[goalKeeperY][goalKeeperX].playerId = teamPlayers.Goalkeeper.id;

  const placeLine = (
    players: Player[],
    startingY: number,
    laneOffset: number,
  ) => {
    const xPositions = getPitchXPositions(players.length);
    players.forEach((player, index) => {
      const x = xPositions[index] ?? xPositions[xPositions.length - 1];
      const y = isHomeTeam
        ? startingY + laneOffset * index
        : PITCH_LENGTH - 1 - (startingY + laneOffset * index);
      pitch[y][x].playerId = player.id;
    });
  };

  placeLine(teamPlayers.Defenders, 7, 2);
  placeLine(teamPlayers.Midfielders, 22, 2);
  placeLine(teamPlayers.Forwards, 35, 2);
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
