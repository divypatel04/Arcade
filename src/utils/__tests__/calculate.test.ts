import {
  calculateKD,
  calculateKDA,
  calculateWinRate,
  calculateHeadshotPercentage,
  calculateAccuracy,
  calculateAverage,
} from '../calculate';

describe('Calculate Utils', () => {
  describe('calculateKD', () => {
    it('should calculate K/D ratio correctly', () => {
      expect(calculateKD(10, 5)).toBe(2);
      expect(calculateKD(15, 10)).toBe(1.5);
      expect(calculateKD(8, 4)).toBe(2);
    });

    it('should handle zero deaths', () => {
      expect(calculateKD(10, 0)).toBe(10);
      expect(calculateKD(5, 0)).toBe(5);
    });

    it('should handle zero kills', () => {
      expect(calculateKD(0, 5)).toBe(0);
      expect(calculateKD(0, 10)).toBe(0);
    });

    it('should handle both zero', () => {
      expect(calculateKD(0, 0)).toBe(0);
    });
  });

  describe('calculateKDA', () => {
    it('should calculate KDA correctly', () => {
      expect(calculateKDA(10, 5, 8)).toBe(3.6);
      expect(calculateKDA(15, 10, 12)).toBe(2.7);
    });

    it('should handle zero deaths', () => {
      expect(calculateKDA(10, 0, 5)).toBe(15);
    });

    it('should handle all zeros', () => {
      expect(calculateKDA(0, 0, 0)).toBe(0);
    });
  });

  describe('calculateWinRate', () => {
    it('should calculate win rate correctly', () => {
      // calculateWinRate takes (wins, losses) not (wins, totalMatches)
      expect(calculateWinRate(7, 3)).toBe(70); // 7 wins, 3 losses = 7/10 = 70%
      expect(calculateWinRate(5, 5)).toBe(50); // 5 wins, 5 losses = 5/10 = 50%
      expect(calculateWinRate(1, 9)).toBe(10); // 1 win, 9 losses = 1/10 = 10%
    });

    it('should handle edge cases', () => {
      expect(calculateWinRate(0, 0)).toBe(0);
    });

    it('should handle 100% win rate', () => {
      expect(calculateWinRate(10, 0)).toBe(100); // 10 wins, 0 losses = 10/10 = 100%
    });

    it('should handle 0% win rate', () => {
      expect(calculateWinRate(0, 10)).toBe(0); // 0 wins, 10 losses = 0/10 = 0%
    });
  });

  describe('calculateHeadshotPercentage', () => {
    it('should calculate headshot percentage correctly', () => {
      expect(calculateHeadshotPercentage(30, 100)).toBe(30);
      expect(calculateHeadshotPercentage(15, 50)).toBe(30);
      expect(calculateHeadshotPercentage(1, 10)).toBe(10);
    });

    it('should handle zero total kills', () => {
      expect(calculateHeadshotPercentage(0, 0)).toBe(0);
    });

    it('should handle 100% headshots', () => {
      expect(calculateHeadshotPercentage(10, 10)).toBe(100);
    });
  });

  describe('calculateAccuracy', () => {
    it('should calculate accuracy correctly', () => {
      expect(calculateAccuracy(50, 100)).toBe(50);
      expect(calculateAccuracy(75, 100)).toBe(75);
      expect(calculateAccuracy(1, 10)).toBe(10);
    });

    it('should handle zero total shots', () => {
      expect(calculateAccuracy(0, 0)).toBe(0);
    });

    it('should handle perfect accuracy', () => {
      expect(calculateAccuracy(100, 100)).toBe(100);
    });
  });

  describe('calculateAverage', () => {
    it('should calculate average correctly', () => {
      expect(calculateAverage([1, 2, 3, 4, 5])).toBe(3);
      expect(calculateAverage([10, 20, 30])).toBe(20);
      expect(calculateAverage([5])).toBe(5);
    });

    it('should handle empty array', () => {
      expect(calculateAverage([])).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(calculateAverage([1.5, 2.5, 3.5])).toBeCloseTo(2.5);
    });
  });
});
