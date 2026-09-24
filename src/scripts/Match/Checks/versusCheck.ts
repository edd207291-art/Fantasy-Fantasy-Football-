import { performCheck } from "./performCheck";

// If positive target 1 wins, if negative target 2 wins, if 0 tie
export function versusCheck(target1: number, target2: number): number {
  return performCheck(target1) - performCheck(target2);
}
