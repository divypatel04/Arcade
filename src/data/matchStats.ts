import { MatchStatType } from "../types/MatchStatType";

const matchStats: MatchStatType[] = [
  {
    general: {
      matchId: "m-001",
      mapId: "ascent",
      seasonId: "s6a1",
      queueId: "competitive",
      gameStartMillis: 1666891200000, // Oct 27, 2022
      gameLengthMillis: 2340000, // 39 minutes
      isRanked: true,
      winningTeam: "blue",
      roundsPlayed: 24,
      agent: {
        id: "jett",
        name: "Jett",
        role: "Duelist",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fjett.webp?alt=media&token=f673816a-e3f9-493e-9684-f70c382fc4b8"	,
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agentIcon%2Fjett_icon.jpg?alt=media&token=209c5da4-cee3-4fdb-bdab-b03788ac37ec"	,
        abilities: [
          {
            id: "updraft",
            name: "Updraft",
            imageUrl: "/abilities/updraft.png",
            type: "basic",
            cost: 150
          },
          {
            id: "tailwind",
            name: "Tailwind",
            imageUrl: "/abilities/tailwind.png",
            type: "signature",
            cost: 0
          },
          {
            id: "cloudburst",
            name: "Cloudburst",
            imageUrl: "/abilities/cloudburst.png",
            type: "basic",
            cost: 200
          },
          {
            id: "bladestorm",
            name: "Blade Storm",
            imageUrl: "/abilities/bladestorm.png",
            type: "ultimate",
            cost: 7
          }
        ]
      },
      map: {
        id: "ascent",
        name: "Ascent",
        location: "Italy",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a"	,
        mapCoordinate: {
          xMultiplier: 0.00007,
          yMultiplier: -0.00007,
          xScalarToAdd: 0.813895,
          yScalarToAdd: 0.573242
        }
      },
      season: {
        id: "s6a1",
        name: "Episode 6 Act 1",
        isActive: false
      }
    },
    playerVsplayerStat: {
      user: {
        id: "player-001",
        teamId: "blue",
        name: "ValorantPro",
        stats: {
          name: "ValorantPro",
          kills: 24,
          deaths: 14,
          assists: 6,
          firstBloods: 4,
          clutchesWon: 2,
          clutchAttempts: 3,
          headshotPercentage: 32.5,
          damagePerRound: 156.3,
          kdRatio: 1.71,
          aces: 1,
          playtimeMillis: 2340000,
          roundsPlayed: 24,
          roundsWon: 13,
          roundsLost: 11
        }
      },
      enemies: [
        {
          id: "player-005",
          teamId: "red",
          name: "SharpShooter",
          stats: {
            name: "SharpShooter",
            kills: 18,
            deaths: 16,
            assists: 5,
            firstBloods: 3,
            clutchesWon: 1,
            clutchAttempts: 2,
            headshotPercentage: 28.6,
            damagePerRound: 143.2,
            kdRatio: 1.13,
            aces: 0,
            playtimeMillis: 2340000,
            roundsPlayed: 24,
            roundsWon: 11,
            roundsLost: 13
          }
        }
      ],
      killEvents: [
        {
          killer: "ValorantPro",
          victim: "SharpShooter",
          weapon: "Vandal",
          headshot: true,
          timestamp: "00:01:42",
          round: 3
        },
        {
          killer: "SharpShooter",
          victim: "ValorantPro",
          weapon: "Operator",
          headshot: true,
          timestamp: "00:02:30",
          round: 5
        }
      ],
      clutchEvents: [
        {
          player: "ValorantPro",
          situation: "1v2",
          round: 8,
          won: true
        },
        {
          player: "ValorantPro",
          situation: "1v3",
          round: 15,
          won: true
        }
      ],
      mapData: {
        kills: {
          "player-001": [{ x: 235, y: 148 }, { x: 356, y: 222 }]
        },
        deaths: {
          "player-001": [{ x: 184, y: 265 }]
        }
      },
      mapCoordinates: {
        xMultiplier: 0.0625,
        yMultiplier: 0.0625,
        xScalarToAdd: 0,
        yScalarToAdd: 0
      }
    },
    teamStats: [
      {
        team: "Blue Team",
        teamId: "blue",
        firstKills: 14,
        thrifties: 2,
        postPlantsWon: 7,
        postPlantsLost: 3,
        clutchesWon: 4
      },
      {
        team: "Red Team",
        teamId: "red",
        firstKills: 10,
        thrifties: 1,
        postPlantsWon: 5,
        postPlantsLost: 4,
        clutchesWon: 2
      }
    ],
    roundPerformace: [
      {
        roundNumber: 1,
        outcome: "win",
        impactScore: 245,
        combat: {
          kills: 2,
          deaths: 0,
          assists: 0,
          damageDealt: 310,
          headshotPercentage: 50,
          tradedKill: false,
          tradeKill: false
        },
        economy: {
          weaponType: "rifle",
          armorType: "heavy",
          creditSpent: 3900,
          loadoutValue: 4500,
          enemyLoadoutValue: 4300
        },
        positioning: {
          site: "A",
          positionType: "entry",
          firstContact: true,
          timeToFirstContact: 24
        },
        utility: {
          abilitiesUsed: 3,
          totalAbilities: 4,
          utilityDamage: 0
        },
        improvement: ["Use utility more effectively", "Consider off-angles"]
      }
    ]
  },
  {
    general: {
      matchId: "m-002",
      mapId: "bind",
      seasonId: "s6a2",
      queueId: "competitive",
      gameStartMillis: 1670284800000, // Dec 5, 2022
      gameLengthMillis: 1980000, // 33 minutes
      isRanked: true,
      winningTeam: "red",
      roundsPlayed: 20,
      agent: {
        id: "chamber",
        name: "Chamber",
        role: "Sentinel",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fchamber.webp?alt=media&token=0fad0eae-ed22-44c2-9571-05a0919d3dbd"	,
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agentIcon%2Fchamber_icon.jpg?alt=media&token=f95eed4c-da03-4d16-b652-dcd0dfead756"	,
        abilities: [
          {
            id: "headhunter",
            name: "Headhunter",
            imageUrl: "/abilities/headhunter.png",
            type: "basic",
            cost: 100
          },
          {
            id: "rendezvous",
            name: "Rendezvous",
            imageUrl: "/abilities/rendezvous.png",
            type: "signature",
            cost: 0
          },
          {
            id: "trademark",
            name: "Trademark",
            imageUrl: "/abilities/trademark.png",
            type: "basic",
            cost: 200
          },
          {
            id: "tour-de-force",
            name: "Tour De Force",
            imageUrl: "/abilities/tour-de-force.png",
            type: "ultimate",
            cost: 8
          }
        ]
      },
      map: {
        id: "bind",
        name: "Bind",
        location: "Morocco",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fbind.png?alt=media&token=7b445e03-211b-488b-b9d1-0be2c9d8c72e"	,
        mapCoordinate: {
          xMultiplier: 0.000059,
          yMultiplier: -0.000059,
          xScalarToAdd: 0.576941,
          yScalarToAdd: 0.967566
        }
      },
      season: {
        id: "s6a2",
        name: "Episode 6 Act 2",
        isActive: false
      }
    },
    playerVsplayerStat: {
      user: {
        id: "player-002",
        teamId: "blue",
        name: "SniperElite",
        stats: {
          name: "SniperElite",
          kills: 18,
          deaths: 16,
          assists: 4,
          firstBloods: 5,
          clutchesWon: 1,
          clutchAttempts: 3,
          headshotPercentage: 42.1,
          damagePerRound: 168.5,
          kdRatio: 1.13,
          aces: 0,
          playtimeMillis: 1980000,
          roundsPlayed: 20,
          roundsWon: 8,
          roundsLost: 12
        }
      },
      enemies: [
        {
          id: "player-006",
          teamId: "red",
          name: "PhantomMaster",
          stats: {
            name: "PhantomMaster",
            kills: 23,
            deaths: 14,
            assists: 7,
            firstBloods: 6,
            clutchesWon: 2,
            clutchAttempts: 4,
            headshotPercentage: 36.8,
            damagePerRound: 175.6,
            kdRatio: 1.64,
            aces: 1,
            playtimeMillis: 1980000,
            roundsPlayed: 20,
            roundsWon: 12,
            roundsLost: 8
          }
        }
      ],
      killEvents: [
        {
          killer: "SniperElite",
          victim: "PhantomMaster",
          weapon: "Operator",
          headshot: true,
          timestamp: "00:01:15",
          round: 2
        },
        {
          killer: "PhantomMaster",
          victim: "SniperElite",
          weapon: "Phantom",
          headshot: false,
          timestamp: "00:03:45",
          round: 7
        }
      ],
      clutchEvents: [
        {
          player: "SniperElite",
          situation: "1v2",
          round: 10,
          won: true
        }
      ],
      mapData: {
        kills: {
          "player-002": [{ x: 215, y: 182 }, { x: 324, y: 145 }]
        },
        deaths: {
          "player-002": [{ x: 198, y: 235 }]
        }
      },
      mapCoordinates: {
        xMultiplier: 0.07,
        yMultiplier: 0.07,
        xScalarToAdd: 0,
        yScalarToAdd: 0
      }
    },
    teamStats: [
      {
        team: "Blue Team",
        teamId: "blue",
        firstKills: 9,
        thrifties: 1,
        postPlantsWon: 4,
        postPlantsLost: 6,
        clutchesWon: 2
      },
      {
        team: "Red Team",
        teamId: "red",
        firstKills: 11,
        thrifties: 2,
        postPlantsWon: 7,
        postPlantsLost: 3,
        clutchesWon: 4
      }
    ],
    roundPerformace: [
      {
        roundNumber: 5,
        outcome: "loss",
        impactScore: 180,
        combat: {
          kills: 1,
          deaths: 1,
          assists: 1,
          damageDealt: 210,
          headshotPercentage: 100,
          tradedKill: false,
          tradeKill: true
        },
        economy: {
          weaponType: "sniper",
          armorType: "heavy",
          creditSpent: 4700,
          loadoutValue: 5200,
          enemyLoadoutValue: 4100
        },
        positioning: {
          site: "B",
          positionType: "hold",
          firstContact: false,
          timeToFirstContact: 35
        },
        utility: {
          abilitiesUsed: 2,
          totalAbilities: 4,
          utilityDamage: 30
        },
        improvement: ["Position farther from angles", "Save utility for retake"]
      }
    ]
  },
  {
    general: {
      matchId: "m-003",
      mapId: "haven",
      seasonId: "s6a3",
      queueId: "unrated",
      gameStartMillis: 1673654400000, // Jan 14, 2023
      gameLengthMillis: 2160000, // 36 minutes
      isRanked: false,
      winningTeam: "blue",
      roundsPlayed: 23,
      agent: {
        id: "sage",
        name: "Sage",
        role: "Sentinel",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fsage.webp?alt=media&token=1bb710cd-d9f2-42aa-80d8-f53863a130ae"	,
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agentIcon%2Fsage_icon.jpg?alt=media&token=74ee511d-63b3-4824-a354-87913d78423a"	,
        abilities: [
          {
            id: "slow-orb",
            name: "Slow Orb",
            imageUrl: "/abilities/slow-orb.png",
            type: "basic",
            cost: 200
          },
          {
            id: "healing-orb",
            name: "Healing Orb",
            imageUrl: "/abilities/healing-orb.png",
            type: "signature",
            cost: 0
          },
          {
            id: "barrier-orb",
            name: "Barrier Orb",
            imageUrl: "/abilities/barrier-orb.png",
            type: "basic",
            cost: 400
          },
          {
            id: "resurrection",
            name: "Resurrection",
            imageUrl: "/abilities/resurrection.png",
            type: "ultimate",
            cost: 8
          }
        ]
      },
      map: {
        id: "haven",
        name: "Haven",
        location: "Bhutan",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fhaven.png?alt=media&token=cd9eb836-3f6e-492a-b76e-00296a095568"	,
        mapCoordinate: {
          xMultiplier: 0.000075,
          yMultiplier: -0.000075,
          xScalarToAdd: 1.09345,
          yScalarToAdd: 0.642728
        }
      },
      season: {
        id: "s6a3",
        name: "Episode 6 Act 3",
        isActive: false
      }
    },
    playerVsplayerStat: {
      user: {
        id: "player-003",
        teamId: "blue",
        name: "HealerSupreme",
        stats: {
          name: "HealerSupreme",
          kills: 14,
          deaths: 16,
          assists: 12,
          firstBloods: 2,
          clutchesWon: 1,
          clutchAttempts: 4,
          headshotPercentage: 24.8,
          damagePerRound: 123.7,
          kdRatio: 0.88,
          aces: 0,
          playtimeMillis: 2160000,
          roundsPlayed: 23,
          roundsWon: 13,
          roundsLost: 10
        }
      },
      enemies: [
        {
          id: "player-007",
          teamId: "red",
          name: "DuelistMain",
          stats: {
            name: "DuelistMain",
            kills: 21,
            deaths: 15,
            assists: 6,
            firstBloods: 4,
            clutchesWon: 2,
            clutchAttempts: 3,
            headshotPercentage: 32.5,
            damagePerRound: 148.3,
            kdRatio: 1.4,
            aces: 0,
            playtimeMillis: 2160000,
            roundsPlayed: 23,
            roundsWon: 10,
            roundsLost: 13
          }
        }
      ],
      killEvents: [
        {
          killer: "HealerSupreme",
          victim: "DuelistMain",
          weapon: "Sheriff",
          headshot: true,
          timestamp: "00:02:10",
          round: 4
        },
        {
          killer: "DuelistMain",
          victim: "HealerSupreme",
          weapon: "Vandal",
          headshot: false,
          timestamp: "00:04:20",
          round: 8
        }
      ],
      clutchEvents: [
        {
          player: "HealerSupreme",
          situation: "1v1",
          round: 19,
          won: true
        }
      ],
      mapData: {
        kills: {
          "player-003": [{ x: 245, y: 178 }, { x: 336, y: 202 }]
        },
        deaths: {
          "player-003": [{ x: 204, y: 255 }, { x: 375, y: 166 }]
        }
      },
      mapCoordinates: {
        xMultiplier: 0.068,
        yMultiplier: 0.068,
        xScalarToAdd: 0,
        yScalarToAdd: 0
      }
    },
    teamStats: [
      {
        team: "Blue Team",
        teamId: "blue",
        firstKills: 12,
        thrifties: 3,
        postPlantsWon: 8,
        postPlantsLost: 4,
        clutchesWon: 3
      },
      {
        team: "Red Team",
        teamId: "red",
        firstKills: 11,
        thrifties: 1,
        postPlantsWon: 6,
        postPlantsLost: 7,
        clutchesWon: 2
      }
    ],
    roundPerformace: [
      {
        roundNumber: 19,
        outcome: "win",
        impactScore: 215,
        combat: {
          kills: 1,
          deaths: 0,
          assists: 2,
          damageDealt: 145,
          headshotPercentage: 0,
          tradedKill: false,
          tradeKill: false
        },
        economy: {
          weaponType: "rifle",
          armorType: "heavy",
          creditSpent: 3900,
          loadoutValue: 4300,
          enemyLoadoutValue: 4600
        },
        positioning: {
          site: "C",
          positionType: "support",
          firstContact: false,
          timeToFirstContact: 42
        },
        utility: {
          abilitiesUsed: 4,
          totalAbilities: 4,
          utilityDamage: 0
        },
        improvement: ["Consider different wall placement", "Heal allies sooner"]
      }
    ]
  }
]

export default matchStats;