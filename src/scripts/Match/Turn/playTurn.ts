import { EventType, type Event } from "@/types/event";
import { Pitch, PitchCoordinates } from "@/types/pitch";
import { Player, Position } from "@/types/player";
import { ITeam } from "@/types/team";
import { activatePlayer } from "./activatePlayer";

type PlayerActivation = {
  player: Player;
  teamSide: "home" | "away";
  position: Position;
  restingCoordinates: PitchCoordinates;
};

const getTeamPlayers = (team: ITeam): Player[] => [
  team.teamPlayers.Goalkeeper.player,
  ...team.teamPlayers.Defenders.map(({ player }) => player),
  ...team.teamPlayers.Midfielders.map(({ player }) => player),
  ...team.teamPlayers.Forwards.map(({ player }) => player),
];

const getPlayerTurnOrder = (
  homeClubTeam: ITeam,
  awayClubTeam: ITeam,
): PlayerActivation[] => [
  ...homeClubTeam.teamPlayers.Defenders.map(
    ({ player, restingCoordinates }) => ({
      player,
      teamSide: "home" as const,
      position: Position.Defender,
      restingCoordinates,
    }),
  ),
  ...homeClubTeam.teamPlayers.Midfielders.map(
    ({ player, restingCoordinates }) => ({
      player,
      teamSide: "home" as const,
      position: Position.Midfielder,
      restingCoordinates,
    }),
  ),
  ...homeClubTeam.teamPlayers.Forwards.map(
    ({ player, restingCoordinates }) => ({
      player,
      teamSide: "home" as const,
      position: Position.Forward,
      restingCoordinates: restingCoordinates,
    }),
  ),
  {
    player: homeClubTeam.teamPlayers.Goalkeeper.player,
    teamSide: "home",
    position: Position.Goalkeeper,
    restingCoordinates: homeClubTeam.teamPlayers.Goalkeeper.restingCoordinates,
  },
  ...awayClubTeam.teamPlayers.Defenders.map(
    ({ player, restingCoordinates: restingCoordinates }) => ({
      player,
      teamSide: "away" as const,
      position: Position.Defender,
      restingCoordinates,
    }),
  ),
  ...awayClubTeam.teamPlayers.Midfielders.map(
    ({ player, restingCoordinates }) => ({
      player,
      teamSide: "away" as const,
      position: Position.Midfielder,
      restingCoordinates,
    }),
  ),
  ...awayClubTeam.teamPlayers.Forwards.map(
    ({ player, restingCoordinates }) => ({
      player,
      teamSide: "away" as const,
      position: Position.Forward,
      restingCoordinates,
    }),
  ),
  {
    player: awayClubTeam.teamPlayers.Goalkeeper.player,
    teamSide: "away",
    position: Position.Goalkeeper,
    restingCoordinates: awayClubTeam.teamPlayers.Goalkeeper.restingCoordinates,
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
  turnsInMatch,
}: {
  pitch: Pitch;
  homeClubTeam: ITeam;
  awayClubTeam: ITeam;
  turn: number;
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  turnsInMatch: number;
}): {
  pitch: Pitch;
  homeGoals: number;
  awayGoals: number;
  events: Event[];
} => {
  const currentTurn = turn + 1;
  console.log(`Match ${matchId} - Turn ${currentTurn}`);
  const homeClubPlayers = getTeamPlayers(homeClubTeam);
  const awayClubPlayers = getTeamPlayers(awayClubTeam);
  let nextPitch = pitch;
  const events: Event[] = [];
  const playerCycle = getPlayerTurnOrder(homeClubTeam, awayClubTeam);

  playerCycle.forEach(({ player, teamSide, position, restingCoordinates }) => {
    const playerRestingCoordinates = {
      x: restingCoordinates.x,
      y:
        teamSide === "home"
          ? restingCoordinates.y
          : nextPitch.length - 1 - restingCoordinates.y,
    };

    const activation = activatePlayer(
      nextPitch,
      player,
      teamSide,
      homeClubPlayers,
      awayClubPlayers,
      position,
      playerRestingCoordinates,
    );

    nextPitch = activation.pitch;

    if (activation.scored) {
      events.push({
        playerId: player.id,
        type: EventType.SCORE_GOAL,
        matchId,
        time: Math.round((currentTurn / turnsInMatch) * 90).toString(),
      });

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
    events,
  };
};
