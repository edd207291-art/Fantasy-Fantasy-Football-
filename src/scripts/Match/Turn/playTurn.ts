import { Pitch } from "@/types/pitch";
import { Player } from "@/types/player";
import { activatePlayer } from "./activatePlayer";

export const playTurn = ({
  pitch,
  homeClubPlayers,
  awayClubPlayers,
  turn,
  matchId,
  homeGoals,
  awayGoals,
}: {
  pitch: Pitch;
  homeClubPlayers: Player[];
  awayClubPlayers: Player[];
  turn: number;
  matchId: string;
  homeGoals: number;
  awayGoals: number;
}): {
  pitch: Pitch;
  homeGoals: number;
  awayGoals: number;
} => {
  const currentTurn = turn + 1;
  console.log(`Match ${matchId} - Turn ${currentTurn}`);

  let nextPitch = pitch;
  const playerCycle = [
    ...homeClubPlayers.map((player) => ({ player, teamSide: "home" as const })),
    ...awayClubPlayers.map((player) => ({ player, teamSide: "away" as const })),
  ];

  playerCycle.forEach(({ player, teamSide }) => {
    const activation = activatePlayer(
      nextPitch,
      player,
      teamSide,
      homeClubPlayers,
      awayClubPlayers,
    );

    nextPitch = activation.pitch;

    if (activation.scored) {
      if (teamSide === "home") {
        homeGoals += 1;
      } else {
        awayGoals += 1;
      }
    }
  });

  return {
    pitch: nextPitch,
    homeGoals,
    awayGoals,
  };
};
