import { FT_IN_ZONE } from "@/static/GlobalVars";

const getRoundedNumber = (number: number) => Math.round(number);

export const ftToZones = (feet: number) => {
  return getRoundedNumber(feet / FT_IN_ZONE);
};
