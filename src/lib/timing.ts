export type Clock = {
  now: () => number;
};

export const performanceClock: Clock = {
  now: () => performance.now()
};
