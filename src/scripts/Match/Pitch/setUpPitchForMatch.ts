import { Pitch } from "@/types/pitch";
import { ITeam, PlayerPosition, TeamPositions } from "@/types/team";
import { createPitch, PITCH_LENGTH, PITCH_WIDTH } from "./createPitch";

const placeTeamOnPitch = (
  pitch: Pitch,
  teamPlayers: TeamPositions,
  isHomeTeam: boolean,
) => {
  const placePlayer = (playerPosition: PlayerPosition) => {
    const { x, y } = playerPosition.initialCoordinates;
    const pitchY = isHomeTeam ? y : pitch.length - 1 - y;
    pitch[pitchY][x].playerId = playerPosition.player.id;
  };

  placePlayer(teamPlayers.Goalkeeper);
  teamPlayers.Defenders.forEach(placePlayer);
  teamPlayers.Midfielders.forEach(placePlayer);
  teamPlayers.Forwards.forEach(placePlayer);
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
