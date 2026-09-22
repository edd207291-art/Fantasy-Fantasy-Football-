import { clubSuffixes } from "@/static/clubSuffixList";
import { townNames } from "@/static/locationList";

export const generateClubName = (
  existingClubNames: ReadonlySet<string> = new Set(),
): string => {
  let clubName: string;

  do {
    const townName = townNames[Math.floor(Math.random() * townNames.length)];
    const clubSuffix =
      clubSuffixes[Math.floor(Math.random() * clubSuffixes.length)];
    clubName = `${townName} ${clubSuffix}`;
  } while (existingClubNames.has(clubName));

  return clubName;
};
