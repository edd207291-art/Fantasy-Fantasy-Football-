// if positive or 0 succeed, if negative fail
export function performCheck(target: number): number {
  const roll = Math.floor(Math.random() * 100) + 1;

  return target - roll;
}
