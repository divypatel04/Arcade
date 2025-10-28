/**
 * Calculate K/D ratio
 */
export const calculateKD = (kills: number, deaths: number): number => {
  if (deaths === 0) return kills;
  return parseFloat((kills / deaths).toFixed(2));
};

/**
 * Calculate win rate percentage from wins and losses
 */
export const calculateWinRate = (wins: number, losses: number): number => {
  const totalMatches = wins + losses;
  if (totalMatches === 0) return 0;
  return parseFloat(((wins / totalMatches) * 100).toFixed(1));
};

/**
 * Calculate headshot percentage
 */
export const calculateHeadshotPercentage = (
  headshots: number,
  totalKills: number
): number => {
  if (totalKills === 0) return 0;
  return parseFloat(((headshots / totalKills) * 100).toFixed(1));
};

/**
 * Calculate accuracy percentage
 */
export const calculateAccuracy = (
  hits: number,
  totalShots: number
): number => {
  if (totalShots === 0) return 0;
  return parseFloat(((hits / totalShots) * 100).toFixed(1));
};

/**
 * Calculate average
 */
export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / values.length).toFixed(1));
};

/**
 * Calculate average combat score
 */
export const calculateAverageCombatScore = (
  totalScore: number,
  totalMatches: number
): number => {
  if (totalMatches === 0) return 0;
  return Math.round(totalScore / totalMatches);
};

/**
 * Calculate KDA (Kills + Assists / Deaths)
 */
export const calculateKDA = (
  kills: number,
  deaths: number,
  assists: number
): number => {
  if (deaths === 0) return kills + assists;
  return parseFloat(((kills + assists) / deaths).toFixed(2));
};

/**
 * Calculate damage per round
 */
export const calculateDamagePerRound = (
  totalDamage: number,
  totalRounds: number
): number => {
  if (totalRounds === 0) return 0;
  return Math.round(totalDamage / totalRounds);
};

/**
 * Calculate playtime in hours
 */
export const calculatePlaytimeHours = (milliseconds: number): number => {
  return parseFloat((milliseconds / (1000 * 60 * 60)).toFixed(1));
};

/**
 * Calculate time difference in days
 */
export const calculateDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (
  oldValue: number,
  newValue: number
): number => {
  if (oldValue === 0) return 0;
  return parseFloat((((newValue - oldValue) / oldValue) * 100).toFixed(1));
};

/**
 * Calculate rank points needed for next rank
 */
export const calculatePointsToNextRank = (currentRR: number): number => {
  return 100 - currentRR;
};

/**
 * Calculate estimated time to goal (based on average per match)
 */
export const calculateEstimatedMatchesToGoal = (
  current: number,
  goal: number,
  averagePerMatch: number
): number => {
  if (averagePerMatch === 0) return 0;
  const remaining = goal - current;
  return Math.ceil(remaining / averagePerMatch);
};

/**
 * Calculate percentile rank
 */
export const calculatePercentile = (
  value: number,
  allValues: number[]
): number => {
  if (allValues.length === 0) return 0;
  
  const sorted = [...allValues].sort((a, b) => a - b);
  const rank = sorted.filter(v => v < value).length;
  return parseFloat(((rank / sorted.length) * 100).toFixed(1));
};

/**
 * Calculate standard deviation
 */
export const calculateStandardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const avg = calculateAverage(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = calculateAverage(squareDiffs);
  
  return parseFloat(Math.sqrt(avgSquareDiff).toFixed(2));
};

/**
 * Calculate median
 */
export const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  
  return sorted[mid];
};

/**
 * Calculate mode (most frequent value)
 */
export const calculateMode = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  let mode = values[0];
  
  values.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value];
      mode = value;
    }
  });
  
  return mode;
};
