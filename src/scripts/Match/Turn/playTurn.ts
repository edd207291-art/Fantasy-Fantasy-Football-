import type { generateTeam } from "@/scripts/Team/generateTeam";
import { Pitch } from "@/types/pitch";
import { Player, Position } from "@/types/player";
import { activatePlayer } from "./activatePlayer";

type GeneratedTeam = ReturnType<typeof generateTeam>;
type PlayerActivation = {
  player: Player;
  teamSide: "home" | "away";
  position: Position;
};

const getTeamPlayers = (team: GeneratedTeam): Player[] => [
  team.teamPlayers.Goalkeeper,
  ...team.teamPlayers.Defenders,
  ...team.teamPlayers.Midfielders,
  ...team.teamPlayers.Forwards,
];

const getPlayerTurnOrder = (
  homeClubTeam: GeneratedTeam,
  awayClubTeam: GeneratedTeam,
): PlayerActivation[] => [
  ...homeClubTeam.teamPlayers.Defenders.map((player) => ({
    player,
    teamSide: "home" as const,
    position: Position.Defender,
  })),
  ...homeClubTeam.teamPlayers.Midfielders.map((player) => ({
    player,
    teamSide: "home" as const,
    position: Position.Midfielder,
  })),
  ...homeClubTeam.teamPlayers.Forwards.map((player) => ({
    player,
    teamSide: "home" as const,
    position: Position.Forward,
  })),
  {
    player: homeClubTeam.teamPlayers.Goalkeeper,
    teamSide: "home",
    position: Position.Goalkeeper,
  },
  ...awayClubTeam.teamPlayers.Defenders.map((player) => ({
    player,
    teamSide: "away" as const,
    position: Position.Defender,
  })),
  ...awayClubTeam.teamPlayers.Midfielders.map((player) => ({
    player,
    teamSide: "away" as const,
    position: Position.Midfielder,
  })),
  ...awayClubTeam.teamPlayers.Forwards.map((player) => ({
    player,
    teamSide: "away" as const,
    position: Position.Forward,
  })),
  {
    player: awayClubTeam.teamPlayers.Goalkeeper,
    teamSide: "away",
    position: Position.Goalkeeper,
  },
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
  const playerCycle = getPlayerTurnOrder(homeClubTeam, awayClubTeam);

  playerCycle.forEach(({ player, teamSide, position }) => {
    const activation = activatePlayer(
      nextPitch,
      player,
      teamSide,
      homeClubPlayers,
      awayClubPlayers,
      position,
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
