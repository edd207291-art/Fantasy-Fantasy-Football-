import { store } from "@/store";
import { getPlayersInClub } from "@/store/clubsSlice";
import { Match } from "@/types/match";
import { Pitch, PitchZone } from "@/types/pitch";
import { Player, Position } from "@/types/player";
import { getBestPosition } from "../Player/getBestPosition";
import { movePlayer } from "./Actions/moving";
import { shootBall } from "./Actions/shooting";
import { tackle } from "./Actions/tackle";
import { findBallCarrierZone } from "./Actions/Utils/findBallCarrierZone";
import { getDistanceInSquares } from "./Actions/Utils/getDistanceInSquares";
import { moveTowardCoordinate } from "./Actions/Utils/moveTowardCoordinate";
import { setUpPitchForMatch } from "./Pitch/setUpPitchForMatch";

const clonePitch = (pitch: Pitch): Pitch =>
  pitch.map((row) =>
    row.map((zone) => ({
      ...zone,
      coordinates: { ...zone.coordinates },
    })),
  );

type TeamSide = "home" | "away";

type ActivationResult = {
  pitch: Pitch;
  scored: boolean;
};

const TOTAL_TURNS = 500;

const getPlayerZone = (pitch: Pitch, playerId: string): PitchZone | null =>
  pitch.flat().find((zone) => zone.playerId === playerId) ?? null;

const isInOpponentGoalArea = (zone: PitchZone, teamSide: TeamSide): boolean =>
  teamSide === "home" ? zone.inAwayGoalArea : zone.inHomeGoalArea;

const hasTackleSpace = (
  pitch: Pitch,
  attackerZone: PitchZone,
  ballCarrierZone: PitchZone,
  attackerId: string,
): boolean => {
  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      if (offsetX === 0 && offsetY === 0) {
        continue;
      }

      const adjacentZone =
        pitch[ballCarrierZone.coordinates.y + offsetY]?.[
          ballCarrierZone.coordinates.x + offsetX
        ];

      if (
        adjacentZone &&
        (adjacentZone.playerId === undefined ||
          adjacentZone.playerId === attackerId) &&
        getDistanceInSquares(
          attackerZone.coordinates,
          adjacentZone.coordinates,
        ) <= 3
      ) {
        return true;
      }
    }
  }

  return false;
};

export const getTeamWithBall = (
  pitch: Pitch,
  homeClubPlayers: Player[],
  awayClubPlayers: Player[],
): TeamSide | null => {
  const ballCarrierId = findBallCarrierZone(pitch)?.playerId;

  if (!ballCarrierId) {
    return null;
  }

  if (homeClubPlayers.some((player) => player.id === ballCarrierId)) {
    return "home";
  }

  if (awayClubPlayers.some((player) => player.id === ballCarrierId)) {
    return "away";
  }

  return null;
};

const activatePlayer = (
  pitch: Pitch,
  playerBeingActivated: Player,
  teamSide: TeamSide,
  homeClubPlayers: Player[],
  awayClubPlayers: Player[],
): ActivationResult => {
  const activePlayerZone = getPlayerZone(pitch, playerBeingActivated.id);

  if (!activePlayerZone) {
    return { pitch, scored: false };
  }

  if (getBestPosition(playerBeingActivated).position === Position.Goalkeeper) {
    const isInOwnGoalArea =
      teamSide === "home"
        ? activePlayerZone.inHomeGoalArea
        : activePlayerZone.inAwayGoalArea;

    if (isInOwnGoalArea) {
      return { pitch, scored: false };
    }

    const goalAreaTarget = pitch
      .flat()
      .filter((zone) =>
        teamSide === "home" ? zone.inHomeGoalArea : zone.inAwayGoalArea,
      )
      .sort(
        (first, second) =>
          getDistanceInSquares(
            activePlayerZone.coordinates,
            first.coordinates,
          ) -
          getDistanceInSquares(
            activePlayerZone.coordinates,
            second.coordinates,
          ),
      )[0];

    if (!goalAreaTarget) {
      return { pitch, scored: false };
    }

    const destination = moveTowardCoordinate(
      activePlayerZone.coordinates,
      goalAreaTarget.coordinates,
      2,
    );
    const destinationZone = pitch[destination.y]?.[destination.x];

    if (!destinationZone) {
      return { pitch, scored: false };
    }

    return {
      pitch: movePlayer(
        pitch,
        playerBeingActivated,
        activePlayerZone,
        destinationZone,
        activePlayerZone.containsBall,
      ).newPitch,
      scored: false,
    };
  }

  if (activePlayerZone.containsBall) {
    const opponentPlayers =
      teamSide === "home" ? awayClubPlayers : homeClubPlayers;
    const opponentGoalkeeper = opponentPlayers.find(
      (player) => getBestPosition(player).position === Position.Goalkeeper,
    );
    const goalkeeperZone = opponentGoalkeeper
      ? getPlayerZone(pitch, opponentGoalkeeper.id)
      : null;
    const isInOpposingGoalArea = isInOpponentGoalArea(
      activePlayerZone,
      teamSide,
    );

    if (isInOpposingGoalArea && opponentGoalkeeper && goalkeeperZone) {
      console.log(
        `Player ${playerBeingActivated.name} is attempting to shoot at the goal.`,
      );
      const shot = shootBall(
        pitch,
        playerBeingActivated,
        opponentGoalkeeper,
        activePlayerZone,
        goalkeeperZone,
      );
      console.log(`Shot result: ${shot.scored ? "Goal!" : "Missed!"}`);
      return { pitch: shot.newPitch, scored: shot.scored };
    }

    const goalZone = pitch
      .flat()
      .find((zone) =>
        teamSide === "home" ? zone.awayGoalMouth : zone.homeGoalMouth,
      );

    if (!goalZone) {
      return { pitch, scored: false };
    }

    const destination = moveTowardCoordinate(
      activePlayerZone.coordinates,
      goalZone.coordinates,
      2,
    );
    const destinationZone = pitch[destination.y]?.[destination.x];

    if (
      !destinationZone ||
      (destination.x === activePlayerZone.coordinates.x &&
        destination.y === activePlayerZone.coordinates.y)
    ) {
      return { pitch, scored: false };
    }

    return {
      pitch: movePlayer(
        pitch,
        playerBeingActivated,
        activePlayerZone,
        destinationZone,
        true,
      ).newPitch,
      scored: false,
    };
  }

  const ballZone = findBallCarrierZone(pitch);

  if (!ballZone) {
    return { pitch, scored: false };
  }

  const opponentPlayers =
    teamSide === "home" ? awayClubPlayers : homeClubPlayers;
  const ballCarrier = ballZone.playerId
    ? opponentPlayers.find((player) => player.id === ballZone.playerId)
    : undefined;
  const distanceToBall = ballCarrier
    ? getDistanceInSquares(activePlayerZone.coordinates, ballZone.coordinates)
    : Number.POSITIVE_INFINITY;

  if (
    ballCarrier &&
    distanceToBall <= 3 &&
    hasTackleSpace(pitch, activePlayerZone, ballZone, playerBeingActivated.id)
  ) {
    const tackleResult = tackle(
      pitch,
      playerBeingActivated,
      ballCarrier,
      activePlayerZone,
    );

    return { pitch: tackleResult.newPitch, scored: false };
  }

  const destination = moveTowardCoordinate(
    activePlayerZone.coordinates,
    ballZone.coordinates,
    2,
  );
  const destinationZone = pitch[destination.y]?.[destination.x];

  if (
    !destinationZone ||
    (destination.x === activePlayerZone.coordinates.x &&
      destination.y === activePlayerZone.coordinates.y)
  ) {
    return { pitch, scored: false };
  }

  return {
    pitch: movePlayer(
      pitch,
      playerBeingActivated,
      activePlayerZone,
      destinationZone,
      false,
    ).newPitch,
    scored: false,
  };
};

const playTurn = ({
  pitch,
  possessionTeam,
  homeClubPlayers,
  awayClubPlayers,
  turn,
  matchId,
  homeGoals,
  awayGoals,
}: {
  pitch: Pitch;
  possessionTeam: TeamSide;
  homeClubPlayers: Player[];
  awayClubPlayers: Player[];
  turn: number;
  matchId: string;
  homeGoals: number;
  awayGoals: number;
}): {
  pitch: Pitch;
  possessionTeam: TeamSide;
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
    possessionTeam:
      getTeamWithBall(nextPitch, homeClubPlayers, awayClubPlayers) ??
      possessionTeam,
    homeGoals,
    awayGoals,
  };
};

export const playMatch = (match: Match): Match => {
  const state = store.getState();
  const homeClubPlayers = getPlayersInClub(state, match.homeClubId);
  const awayClubPlayers = getPlayersInClub(state, match.awayClubId);
  let pitch = setUpPitchForMatch(homeClubPlayers, awayClubPlayers).pitch;
  const pitchHistory: Pitch[] = [clonePitch(pitch)];
  let homeGoals = 0;
  let awayGoals = 0;
  let possessionTeam: TeamSide = "home";

  for (let turn = 0; turn < TOTAL_TURNS; turn += 1) {
    const turnResult = playTurn({
      pitch,
      possessionTeam,
      homeClubPlayers,
      awayClubPlayers,
      turn,
      matchId: match.id,
      homeGoals,
      awayGoals,
    });

    pitch = turnResult.pitch;
    possessionTeam = turnResult.possessionTeam;
    homeGoals = turnResult.homeGoals;
    awayGoals = turnResult.awayGoals;
    pitchHistory.push(clonePitch(pitch));
  }

  const score = { home: homeGoals, away: awayGoals };
  const winnerClubId =
    homeGoals === awayGoals
      ? null
      : homeGoals > awayGoals
        ? match.homeClubId
        : match.awayClubId;

  console.log(
    `Match ${match.id} ended. Final Score: Home ${homeGoals} - Away ${awayGoals}. Winner: ${winnerClubId ?? "Draw"}`,
  );

  return {
    ...match,
    score,
    pitchHistory,
    result: {
      winnerClubId,
      score,
      pitchStates: pitchHistory,
    },
  };
};
