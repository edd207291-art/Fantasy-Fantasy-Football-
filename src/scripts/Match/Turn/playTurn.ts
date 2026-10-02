import type { generateTeam } from "@/scripts/Team/generateTeam";
import { Pitch } from "@/types/pitch";
import { Player } from "@/types/player";
import { activatePlayer } from "./activatePlayer";

type GeneratedTeam = ReturnType<typeof generateTeam>;

const getTeamPlayers = (team: GeneratedTeam): Player[] => [
  team.teamPlayers.Goalkeeper,
  ...team.teamPlayers.Defenders,
  ...team.teamPlayers.Midfielders,
  ...team.teamPlayers.Forwards,
];

export const playTurn = ({
  pitch,
  homeClubTeam,
  awayClubTeam,
  turn,
  matchId,
  homeGoals,
  awayGoals,
}: {
  pitch: Pitch;
  homeClubTeam: GeneratedTeam;
  awayClubTeam: GeneratedTeam;
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

  const homeClubPlayers = getTeamPlayers(homeClubTeam);
  const awayClubPlayers = getTeamPlayers(awayClubTeam);
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
