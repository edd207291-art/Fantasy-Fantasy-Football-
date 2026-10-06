import { Pitch } from "@/types/pitch";
import { Player } from "@/types/player";
import { versusCheck } from "../../Checks/versusCheck";
import { getPlayerZone } from "../Utils/getPlayerZone";

export type ShotOutcome = {
  scored: boolean;
  pitch: Pitch;
  newPitch: Pitch;
};

export const shootBall = (
  pitch: Pitch,
  shooter: Player,
  goalkeeper: Player,
): ShotOutcome => {
  let newPitch = [...pitch];

  const shooterRoll = shooter.Shooting;
  const goalkeeperRoll = goalkeeper.Defending;
  const totalRoll = versusCheck(shooterRoll, goalkeeperRoll);

  const scored = totalRoll > 0;
  //clear ball off pitch
  newPitch = newPitch.map((row) =>
    row.map((zone) => ({ ...zone, containsBall: false })),
  );

  if (scored) {
    // ball does in center of pitch
    const centerX = Math.floor(pitch[0].length / 2);
    const centerY = Math.floor(pitch.length / 2);
    newPitch[centerY][centerX].containsBall = true;
  } else {
    //keeper gets ball
    const goalKeeperZone = getPlayerZone(newPitch, goalkeeper.id);
    // TODO - BUG sometimes goalkeeper zone is not found
    if (goalKeeperZone) {
      newPitch[goalKeeperZone.coordinates.y][
        goalKeeperZone.coordinates.x
      ].containsBall = true;
    } else {
      //place ball in center of pitch
      const centerX = Math.floor(pitch[0].length / 2);
      const centerY = Math.floor(pitch.length / 2);
      newPitch[centerY][centerX].containsBall = true;
    }
  }

  return {
    scored,
    pitch,
    newPitch,
  };
};

export default shootBall;
