import { WeaponStatType } from "../types/WeaponStatsType";

const weaponStats: WeaponStatType[] = [
  {
    playerId: "player-001",
    weapon: {
      id: "weapon-001",
      name: "Vandal",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Fvandal.png?alt=media&token=858dd763-6723-4f37-8f5b-3c9b57125bd6"	,
      type: "Rifle"
    },
    performanceBySeason: [
      {
        season: {
          id: "season-001",
          name: "Episode 1: Act 1",
          isActive: false
        },
        stats: {
          kills: 345,
          damage: 51750,
          aces: 3,
          firstKills: 67,
          roundsPlayed: 230,
          avgKillsPerRound: 1.5,
          avgDamagePerRound: 225,
          legshots: 78,
          headshots: 156,
          bodyshots: 111
        }
      },
      {
        season: {
          id: "season-002",
          name: "Episode 1: Act 2",
          isActive: true
        },
        stats: {
          kills: 412,
          damage: 61800,
          aces: 5,
          firstKills: 89,
          roundsPlayed: 275,
          avgKillsPerRound: 1.5,
          avgDamagePerRound: 224.7,
          legshots: 94,
          headshots: 186,
          bodyshots: 132
        }
      }
    ]
  },
  {
    playerId: "player-002",
    weapon: {
      id: "weapon-002",
      name: "Phantom",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Fphantom.png?alt=media&token=c09ef1d3-5f7d-4dd7-a443-41bb7f612e3e"	,
      type: "Rifle"
    },
    performanceBySeason: [
      {
        season: {
          id: "season-002",
          name: "Episode 1: Act 2",
          isActive: true
        },
        stats: {
          kills: 387,
          damage: 48375,
          aces: 2,
          firstKills: 73,
          roundsPlayed: 258,
          avgKillsPerRound: 1.5,
          avgDamagePerRound: 187.5,
          legshots: 85,
          headshots: 174,
          bodyshots: 128
        }
      }
    ]
  },
  {
    playerId: "player-001",
    weapon: {
      id: "weapon-003",
      name: "Operator",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Foperator.png?alt=media&token=63a02eeb-c0f3-422c-9ac5-c5865000503d",
      type: "Sniper"
    },
    performanceBySeason: [
      {
        season: {
          id: "season-002",
          name: "Episode 1: Act 2",
          isActive: true
        },
        stats: {
          kills: 156,
          damage: 31200,
          aces: 1,
          firstKills: 47,
          roundsPlayed: 120,
          avgKillsPerRound: 1.3,
          avgDamagePerRound: 260,
          legshots: 12,
          headshots: 89,
          bodyshots: 55
        }
      }
    ]
  },
  {
    playerId: "player-003",
    weapon: {
      id: "weapon-004",
      name: "Sheriff",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Fsheriff.png?alt=media&token=54a2b469-a288-4093-8936-78f96f686217",
      type: "Sidearm"
    },
    performanceBySeason: [
      {
        season: {
          id: "season-001",
          name: "Episode 1: Act 1",
          isActive: false
        },
        stats: {
          kills: 124,
          damage: 18600,
          aces: 0,
          firstKills: 18,
          roundsPlayed: 186,
          avgKillsPerRound: 0.67,
          avgDamagePerRound: 100,
          legshots: 27,
          headshots: 75,
          bodyshots: 22
        }
      }
    ]
  },
  {
    playerId: "player-004",
    weapon: {
      id: "weapon-005",
      name: "Odin",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Fodin.png?alt=media&token=5e4f5537-0564-4a19-913c-c2b6ad8c534a",
      type: "Heavy"
    },
    performanceBySeason: [
      {
        season: {
          id: "season-001",
          name: "Episode 1: Act 1",
          isActive: false
        },
        stats: {
          kills: 213,
          damage: 42600,
          aces: 2,
          firstKills: 21,
          roundsPlayed: 178,
          avgKillsPerRound: 1.2,
          avgDamagePerRound: 239.3,
          legshots: 64,
          headshots: 67,
          bodyshots: 82
        }
      },
      {
        season: {
          id: "season-002",
          name: "Episode 1: Act 2",
          isActive: true
        },
        stats: {
          kills: 246,
          damage: 49200,
          aces: 3,
          firstKills: 28,
          roundsPlayed: 205,
          avgKillsPerRound: 1.2,
          avgDamagePerRound: 240,
          legshots: 73,
          headshots: 78,
          bodyshots: 95
        }
      }
    ]
  }
];

export default weaponStats;