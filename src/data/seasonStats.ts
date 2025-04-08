import { SeasonStatsType } from "../types/SeasonStatsType";

const seasonStats: SeasonStatsType[] = [
  {
    season: {
      id: "s1",
      name: "Dawn of Battle",
      isActive: false
    },
    stats: {
      kills: 342,
      deaths: 256,
      roundsWon: 187,
      roundsLost: 143,
      totalRounds: 330,
      plants: 42,
      defuses: 28,
      playtimeMillis: 790000,
      matchesWon: 34,
      matchesLost: 16,
      matchesPlayed: 50,
      damage: 62480,
      firstKill: 18,
      highestRank: 15,
      aces: 2,
      mvps: 14
    }
  },
  {
    season: {
      id: "s2",
      name: "Rise of Tactics",
      isActive: false
    },
    stats: {
      kills: 512,
      deaths: 298,
      roundsWon: 256,
      roundsLost: 174,
      totalRounds: 430,
      plants: 68,
      defuses: 45,
      playtimeMillis: 1150000,
      matchesWon: 47,
      matchesLost: 23,
      matchesPlayed: 70,
      damage: 87650,
      firstKill: 29,
      highestRank: 18,
      aces: 4,
      mvps: 22
    }
  },
  {
    season: {
      id: "s3",
      name: "Shadow Operations",
      isActive: false
    },
    stats: {
      kills: 623,
      deaths: 341,
      roundsWon: 320,
      roundsLost: 204,
      totalRounds: 524,
      plants: 89,
      defuses: 53,
      playtimeMillis: 1580000,
      matchesWon: 58,
      matchesLost: 27,
      matchesPlayed: 85,
      damage: 105230,
      firstKill: 37,
      highestRank: 22,
      aces: 7,
      mvps: 31
    }
  },
  {
    season: {
      id: "s4",
      name: "Phantom Protocol",
      isActive: true
    },
    stats: {
      kills: 247,
      deaths: 182,
      roundsWon: 138,
      roundsLost: 102,
      totalRounds: 240,
      plants: 32,
      defuses: 19,
      playtimeMillis: 620000,
      matchesWon: 24,
      matchesLost: 11,
      matchesPlayed: 35,
      damage: 43720,
      firstKill: 14,
      highestRank: 25,
      aces: 3,
      mvps: 17
    }
  }
];

export default seasonStats;