import { Pitch, PitchCoordinates, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { performCheck } from "../../Checks/performCheck";
import { getDistanceInSquares } from "../Utils/getDistanceInSquares";
import { getRandomOffset } from "../Utils/getRandomOffset";
import { moveTowardCoordinate } from "../Utils/moveTowardCoordinate";

export type PassRange = "short" | "mid" | "long";

export type PassOutcome = {
  passRange: PassRange;
  passerRoll: number;
  passSuccess: boolean;
  receiverRoll: number;
  receiverGetsBall: boolean;
  ballZone: PitchCoordinates;
  targetZone: PitchCoordinates;
  receiverLandingZone: PitchCoordinates;
  startedAt: PitchCoordinates;
  endedAt: PitchCoordinates;
  pitch: Pitch;
  newPitch: Pitch;
};

export const getPassRange = (
  from: PitchCoordinates,
  to: PitchCoordinates,
): PassRange => {
  const distance = getDistanceInSquares(from, to);

  if (distance <= 9) {
    return "short";
  }

  if (distance <= 18) {
    return "mid";
  }

  return "long";
};

export const clearBallFromPitch = (pitch: Pitch): Pitch => {
  pitch.forEach((row) =>
    row.forEach((zone) => {
      zone.containsBall = false;
    }),
  );

  return pitch;
};

export const setBallOnPitch = (pitch: Pitch, zone: PitchCoordinates): Pitch => {
  clearBallFromPitch(pitch);

  const targetZone = pitch[zone.y]?.[zone.x];

  if (targetZone) {
    targetZone.containsBall = true;
  }

  return pitch;
};

export const passBall = (
  pitch: Pitch,
  passer: Player,
  receiver: Player,
  passerZone: PitchZone,
  receiverZone: PitchZone,
): PassOutcome => {
  const passRange = getPassRange(
    passerZone.coordinates,
    receiverZone.coordinates,
  );
  const passerRoll = performCheck(passer.Passing);
  const passSuccess = passerRoll >= 0;
  const targetZone = { ...receiverZone.coordinates };

  let ballZone = { ...targetZone };

  if (!passSuccess) {
    const missDistance = passRange === "short" ? 2 : 5;
    ballZone = getRandomOffset(targetZone, missDistance, pitch);
  }

  if (passRange === "long" && passSuccess) {
    ballZone = getRandomOffset(targetZone, 3, pitch);
  }

  const receiverRoll = performCheck(receiver.Pace);
  let receiverLandingZone = { ...receiverZone.coordinates };
  let receiverGetsBall = false;

  if (receiverRoll >= 0) {
    if (passRange === "short") {
      receiverGetsBall = true;
    } else {
      receiverLandingZone = moveTowardCoordinate(
        receiverZone.coordinates,
        ballZone,
        3,
      );
      receiverGetsBall =
        receiverLandingZone.x === ballZone.x &&
        receiverLandingZone.y === ballZone.y;
    }
  }

  const newPitch = pitch.map((row) =>
    row.map((zone) => ({ ...zone, containsBall: false })),
  );

  const passerZoneOnPitch =
    newPitch[passerZone.coordinates.y]?.[passerZone.coordinates.x];
  if (passerZoneOnPitch && passerZoneOnPitch.playerId === passer.id) {
    passerZoneOnPitch.playerId = undefined;
  }

  const finalBallZone = newPitch[ballZone.y]?.[ballZone.x];

  if (finalBallZone) {
    finalBallZone.containsBall = true;
  }

  const receiverZoneOnPitch =
    newPitch[receiverZone.coordinates.y]?.[receiverZone.coordinates.x];
  if (receiverZoneOnPitch) {
    receiverZoneOnPitch.playerId = receiver.id;
  }

  return {
    passRange,
    passerRoll,
    passSuccess,
    receiverRoll,
    receiverGetsBall,
    ballZone,
    targetZone,
    receiverLandingZone,
    startedAt: passerZone.coordinates,
    endedAt: ballZone,
    pitch,
    newPitch,
  };
};

export default passBall;
