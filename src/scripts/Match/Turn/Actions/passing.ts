import { ftToZones } from "@/scripts/Utils/ftToZones";
import { Pitch, PitchCoordinates, PitchZone } from "@/types/pitch";
import { Player } from "@/types/player";
import { performCheck } from "../../Checks/performCheck";
import { getDistanceInZones } from "../Utils/getDistanceInZones";
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

const SHORT_PASS = ftToZones(45);
const MID_PASS = ftToZones(90);
const SHORT_PASS_MISS_DISTANCE_FEET = 15;
const OTHER_PASS_MISS_DISTANCE_FEET = 30;

export const getPassRange = (
  from: PitchCoordinates,
  to: PitchCoordinates,
): PassRange => {
  const distance = getDistanceInZones(from, to);

  if (distance <= SHORT_PASS) {
    return "short";
  }

  if (distance <= MID_PASS) {
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
  const passerRoll = performCheck(passer.attributes.Passing);
  const passSuccess = passerRoll >= 0;
  const targetZone = { ...receiverZone.coordinates };

  let ballZone = { ...targetZone };

  if (!passSuccess) {
    const missDistance =
      passRange === "short"
        ? SHORT_PASS_MISS_DISTANCE_FEET
        : OTHER_PASS_MISS_DISTANCE_FEET;
    ballZone = getRandomOffset(targetZone, missDistance, pitch);
  }

  const LONG_PASS_OFF_SET_FEET = 15;
  if (passRange === "long" && passSuccess) {
    ballZone = getRandomOffset(targetZone, LONG_PASS_OFF_SET_FEET, pitch);
  }

  const receiverRoll = performCheck(receiver.attributes.Pace);
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
