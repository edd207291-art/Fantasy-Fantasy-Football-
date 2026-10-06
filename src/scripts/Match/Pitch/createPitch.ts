import { FT_IN_ZONE } from "@/static/GlobalVars";
import { Pitch, PitchZone } from "@/types/pitch";
import { getRoundedNumber, getRoundedOddNumber } from "../../Utils/rounding";

export const PITCH_WIDTH = getRoundedOddNumber(220 / FT_IN_ZONE);
export const PITCH_LENGTH = getRoundedOddNumber(345 / FT_IN_ZONE);

const GOAL_WIDTH = getRoundedNumber(25 / FT_IN_ZONE);
const GOAL_AREA_WIDTH = getRoundedNumber(55 / FT_IN_ZONE);
const GOAL_AREA_DEPTH = getRoundedNumber(20 / FT_IN_ZONE);
const PENALTY_AREA_WIDTH = getRoundedNumber(125 / FT_IN_ZONE);
const PENALTY_AREA_DEPTH = getRoundedNumber(55 / FT_IN_ZONE);
const CENTER_CIRCLE_RADIUS = getRoundedNumber(30 / FT_IN_ZONE);
const PENALTY_SPOT_DISTANCE = getRoundedNumber(10 / FT_IN_ZONE);

const isInsideCenteredArea = (
  x: number,
  width: number,
  y: number,
  depth: number,
  fromTop: boolean,
): boolean => {
  const areaStart = Math.ceil((PITCH_WIDTH - width) / 2);
  const depthStart = fromTop ? 0 : PITCH_LENGTH - depth;
  const depthEnd = fromTop ? depth : PITCH_LENGTH;

  return (
    x >= areaStart && x < areaStart + width && y >= depthStart && y < depthEnd
  );
};

const isInsideCenterCircle = (x: number, y: number): boolean => {
  const centerX = PITCH_WIDTH / 2;
  const centerY = PITCH_LENGTH / 2;
  const distanceX = x + 0.5 - centerX;
  const distanceY = y + 0.5 - centerY;

  return Math.sqrt(distanceX ** 2 + distanceY ** 2) <= CENTER_CIRCLE_RADIUS;
};

const createPitchZone = (x: number, y: number): PitchZone => {
  const homeGoalMouth = isInsideCenteredArea(x, GOAL_WIDTH, y, 1, true);
  const awayGoalMouth = isInsideCenteredArea(x, GOAL_WIDTH, y, 1, false);
  const inHomeGoalArea = isInsideCenteredArea(
    x,
    GOAL_AREA_WIDTH,
    y,
    GOAL_AREA_DEPTH,
    true,
  );
  const inAwayGoalArea = isInsideCenteredArea(
    x,
    GOAL_AREA_WIDTH,
    y,
    GOAL_AREA_DEPTH,
    false,
  );
  const inHomePenaltyArea = isInsideCenteredArea(
    x,
    PENALTY_AREA_WIDTH,
    y,
    PENALTY_AREA_DEPTH,
    true,
  );
  const inAwayPenaltyArea = isInsideCenteredArea(
    x,
    PENALTY_AREA_WIDTH,
    y,
    PENALTY_AREA_DEPTH,
    false,
  );

  return {
    coordinates: { x, y },
    homeGoalMouth,
    awayGoalMouth,
    inHomeGoalArea: inHomeGoalArea,
    inAwayGoalArea: inAwayGoalArea,
    inHomePenaltyArea: inHomePenaltyArea,
    inAwayPenaltyArea: inAwayPenaltyArea,
    inHomeHalf: y < PITCH_LENGTH / 2,
    inAwayHalf: y >= PITCH_LENGTH / 2,
    inCenterCircle: isInsideCenterCircle(x, y),
    homePenaltySpot:
      x === Math.floor(PITCH_WIDTH / 2) && y === PENALTY_SPOT_DISTANCE,
    awayPenaltySpot:
      x === Math.floor(PITCH_WIDTH / 2) &&
      y === PITCH_LENGTH - 1 - PENALTY_SPOT_DISTANCE,
  };
};

export const createPitch = (): Pitch =>
  Array.from({ length: PITCH_LENGTH }, (_, y) =>
    Array.from({ length: PITCH_WIDTH }, (_, x) => createPitchZone(x, y)),
  );
