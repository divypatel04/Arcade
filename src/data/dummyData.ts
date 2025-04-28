import { AgentStatType } from "../types/AgentStatsType";
import { MapStatsType } from "../types/MapStatsType";
import { MatchStatsType } from "../types/MatchStatsType";
import { SeasonStatsType } from "../types/SeasonStatsType";
import { WeaponStatsType } from "../types/WeaponStatsType";


export const AgentStats: AgentStatType[] = [
  {
    "playerId": "-6KG-X-bb86rh70DxTjUWx9S6xayM0iYespoQ-2yKkgzhLgWD0gufwXj779nUGvPV9TNWviIp2fpZA",
    "agent": {
      "id": "1e58de9c-4950-5125-93e9-a0aee9f98746",
      "name": "Breach",
      "role": "Initiator",
      "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fbreach.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
      "iconUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fbreach_icon.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
      "abilities": [
        {
          "id": "1e58de9c-4950-5125-93e9-a0aee9f98110",
          "name": "Aftershock",
          "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Faftershock.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
          "type": "Basic",
          "cost": 100
        },
        {
          "id": "1e58de9c-4950-5125-93e9-a0aee9f98111",
          "name": "Flashpoint",
          "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fflashpoint.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
          "type": "Basic",
          "cost": 200
        },
        {
          "id": "1e58de9c-4950-5125-93e9-a0aee9f98112",
          "name": "Fault Line",
          "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Ffaultline.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
          "type": "Signature",
          "cost": 0
        },
        {
          "id": "1e58de9c-4950-5125-93e9-a0aee9f98113",
          "name": "Rolling Thunder",
          "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Frollingthunder.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
          "type": "Ultimate",
          "cost": 7
        }
      ]
    },
    "performanceBySeason": [
      {
        "season": {
          "id": "292f58db-4c17-89a7-b1c0-ba988f0e9d98",
          "name": "EPISODE 9 - ACT 2",
          "isActive": false
        },
        "stats": {
          "kills": 58,
          "deaths": 37,
          "roundsWon": 24,
          "roundsLost": 23,
          "totalRounds": 47,
          "plants": 7,
          "defuses": 0,
          "playtimeMillis": 4851242,
          "matchesWon": 1,
          "matchesLost": 1,
          "aces": 0,
          "firstKills": 20
        },
        "mapStats": [
          {
            "id": "/Game/Maps/Triad/Triad",
            "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fhaven.png?alt=media&token=cd9eb836-3f6e-492a-b76e-00296a095568",
            "name": "Haven",
            "location": "Bhutan, Alpha Earth",
            "wins": 1,
            "losses": 0
          },
          {
            "id": "/Game/Maps/Bonsai/Bonsai",
            "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fsplit.png?alt=media&token=c0ae6438-db27-4281-8d00-28fcfc06dfeb",
            "name": "Split",
            "location": "Japan, Alpha Earth",
            "wins": 0,
            "losses": 1
          }
        ],
        "attackStats": {
          "deaths": 18,
          "kills": 18,
          "roundsLost": 14,
          "roundsWon": 18,
          "clutchStats": {
            "1v1Wins": 2,
            "1v2Wins": 1,
            "1v3Wins": 0,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        "defenseStats": {
          "deaths": 18,
          "kills": 18,
          "roundsLost": 14,
          "roundsWon": 18,
          "clutchStats": {
            "1v1Wins": 2,
            "1v2Wins": 1,
            "1v3Wins": 0,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        "abilityAndUltimateImpact": [
            {
              "type": "grenadeCasts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98110",
              "count": 10,
              "kills": 3,
              "damage": 500
            },
            {
              "type": "ability1Casts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98111",
              "count": 20,
              "kills": 5,
              "damage": 1000
            },
            {
              "type": "ability2Casts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98112",
              "count": 15,
              "kills": 2,
              "damage": 700
            },
            {
              "type": "ultimateCasts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98113",
              "count": 3,
              "kills": 4,
              "damage": 800
            }
        ]
      },
      {
        "season": {
          "id": "292f58db-4c17-89a7-b1c0-ba988f0e9d99",
          "name": "EPISODE 9 - ACT 3",
          "isActive": false
        },
        "stats": {
          "kills": 40,
          "deaths": 37,
          "roundsWon": 24,
          "roundsLost": 23,
          "totalRounds": 47,
          "plants": 7,
          "defuses": 0,
          "playtimeMillis": 4851242,
          "matchesWon": 1,
          "matchesLost": 1,
          "aces": 0,
          "firstKills": 20
        },
        "mapStats": [
          {
            "id": "/Game/Maps/Triad/Triad",
            "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fhaven.png?alt=media&token=cd9eb836-3f6e-492a-b76e-00296a095568",
            "name": "Haven",
            "location": "Bhutan, Alpha Earth",
            "wins": 1,
            "losses": 0
          },
          {
            "id": "/Game/Maps/Bonsai/Bonsai",
            "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fsplit.png?alt=media&token=c0ae6438-db27-4281-8d00-28fcfc06dfeb",
            "name": "Split",
            "location": "Japan, Alpha Earth",
            "wins": 0,
            "losses": 1
          }
        ],
        "attackStats": {
          "deaths": 18,
          "kills": 18,
          "roundsLost": 14,
          "roundsWon": 18,
          "clutchStats": {
            "1v1Wins": 2,
            "1v2Wins": 1,
            "1v3Wins": 0,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        "defenseStats": {
          "deaths": 18,
          "kills": 18,
          "roundsLost": 14,
          "roundsWon": 18,
          "clutchStats": {
            "1v1Wins": 2,
            "1v2Wins": 1,
            "1v3Wins": 0,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        "abilityAndUltimateImpact": [
            {
              "type": "grenadeCasts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98110",
              "count": 10,
              "kills": 3,
              "damage": 500
            },
            {
              "type": "ability1Casts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98111",
              "count": 20,
              "kills": 5,
              "damage": 1000
            },
            {
              "type": "ability2Casts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98112",
              "count": 15,
              "kills": 2,
              "damage": 700
            },
            {
              "type": "ultimateCasts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98113",
              "count": 3,
              "kills": 4,
              "damage": 800
            }
        ]
      }
    ]
  },
  {
    "playerId": "7KG-Y-bb86rh70DxTjUWx9S6xayM0iYespoQ-2yKkgzhLgWD0gufwXj779nUGvPV9TNWviIp2fpZA",
    "agent": {
      "id": "2e58de9c-4950-5125-93e9-a0aee9f98746",
      "name": "Jett",
      "role": "Duelist",
      "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fjett.png?alt=media&token=4b4b4b4b-4b4b-4b4b-4b4b-4b4b4b4b4b4b",
      "iconUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fjett_icon.png?alt=media&token=4b4b4b4b-4b4b-4b4b-4b4b-4b4b4b4b4b4b",
      "abilities": [
        {
          "id": "2e58de9c-4950-5125-93e9-a0aee9f98746",
          "name": "Cloudburst",
          "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fcloudburst.png?alt=media&token=4b4b4b4b-4b4b-4b4b-4b4b-4b4b4b4b4b4b",
          "type": "Basic",
          "cost": 100
        },
        {
          "id": "2e58de9c-4950-5125-93e9-a0aee9f98746",
          "name": "Updraft",
          "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fupdraft.png?alt=media&token=4b4b4b4b-4b4b-4b4b-4b4b-4b4b4b4b4b4b",
          "type": "Basic",
          "cost": 200
        },
        {
          "id": "2e58de9c-4950-5125-93e9-a0aee9f98746",
          "name": "Tailwind",
          "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Ftailwind.png?alt=media&token=4b4b4b4b-4b4b-4b4b-4b4b-4b4b4b4b4b4b",
          "type": "Signature",
          "cost": 0
        },
        {
          "id": "2e58de9c-4950-5125-93e9-a0aee9f98746",
          "name": "Blade Storm",
          "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fbladestorm.png?alt=media&token=4b4b4b4b-4b4b-4b4b-4b4b-4b4b4b4b4b4b",
          "type": "Ultimate",
          "cost": 7
        }
      ]
    },
    "performanceBySeason": [
      {
        "season": {
          "id": "392f58db-4c17-89a7-b1c0-ba988f0e9d98",
          "name": "EPISODE 9 - ACT 3",
          "isActive": true
        },
        "stats": {
          "kills": 75,
          "deaths": 45,
          "roundsWon": 30,
          "roundsLost": 25,
          "totalRounds": 55,
          "plants": 10,
          "defuses": 2,
          "playtimeMillis": 6000000,
          "matchesWon": 2,
          "matchesLost": 1,
          "aces": 1,
          "firstKills": 25
        },
        "mapStats": [
          {
            "id": "/Game/Maps/Ascent/Ascent",
            "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=5b5b5b5b-5b5b-5b5b-5b5b-5b5b5b5b5b5b",
            "name": "Ascent",
            "location": "Italy, Alpha Earth",
            "wins": 2,
            "losses": 0
          },
          {
            "id": "/Game/Maps/Breeze/Breeze",
            "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fbreeze.png?alt=media&token=6b6b6b6b-6b6b-6b6b-6b6b-6b6b6b6b6b6b",
            "name": "Breeze",
            "location": "Caribbean, Alpha Earth",
            "wins": 0,
            "losses": 1
          }
        ],
        "attackStats": {
          "deaths": 20,
          "kills": 30,
          "roundsLost": 15,
          "roundsWon": 25,
          "clutchStats": {
            "1v1Wins": 3,
            "1v2Wins": 2,
            "1v3Wins": 1,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        "defenseStats": {
          "deaths": 25,
          "kills": 45,
          "roundsLost": 10,
          "roundsWon": 30,
          "clutchStats": {
            "1v1Wins": 4,
            "1v2Wins": 3,
            "1v3Wins": 2,
            "1v4Wins": 1,
            "1v5Wins": 0
          }
        },
        "abilityAndUltimateImpact": [
            {
              "type": "grenadeCasts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98110",
              "count": 10,
              "kills": 3,
              "damage": 500
            },
            {
              "type": "ability1Casts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98111",
              "count": 20,
              "kills": 5,
              "damage": 1000
            },
            {
              "type": "ability2Casts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98112",
              "count": 15,
              "kills": 2,
              "damage": 700
            },
            {
              "type": "ultimateCasts",
              "id": "1e58de9c-4950-5125-93e9-a0aee9f98113",
              "count": 3,
              "kills": 4,
              "damage": 800
            }
        ]
      }

    ]
  }
]


export const MapStats: MapStatsType[] = [
  {
    "playerId": "-6KG-X-bb86rh70DxTjUWx9S6xayM0iYespoQ-2yKkgzhLgWD0gufwXj779nUGvPV9TNWviIp2fpZA",
    "map": {
      "id": "1e58de9c-4950-5125-93e9-a0aee9f98746",
      "name": "Ascent",
      "location": "India, Alpha Earth",
      "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      "mapCoordinate": {
        "xMultiplier": 0.00007,
        "yMultiplier": -0.00007,
        "xScalarToAdd": 0.813895,
        "yScalarToAdd": 0.573242
      }
    },
    "performanceBySeason": [
      {
        "season": {
          "id": "292f58db-4c17-89a7-b1c0-ba988f0e9d98",
          "name": "EPISODE 9 - ACT 2",
          "isActive": false
        },
        "stats": {
          "kills": 58,
          "deaths": 37,
          "roundsWon": 24,
          "roundsLost": 23,
          "totalRounds": 47,
          "plants": 7,
          "defuses": 0,
          "playtimeMillis": 4851242,
          "matchesWon": 1,
          "matchesLost": 1,
          "aces": 0,
          "firstKills": 20
        },

        "attackStats": {
          "deaths": 18,
          "kills": 18,
          "roundsLost": 14,
          "roundsWon": 18,
          "HeatmapLocation": {
          "killsLocation": [
            {
              "x": -1750,
              "y": -6572
            },
            {
              "x": 2489,
              "y": -4968
            },
            {
              "x": -1059,
              "y": -6518
            },
            {
              "x": 440,
              "y": -3978
            },
            {
              "x": 6307,
              "y": -5144
            },
            {
              "x": -2011,
              "y": -7853
            },
            {
              "x": 5830,
              "y": -5695
            },
            {
              "x": -2250,
              "y": -4503
            },
            {
              "x": -3042,
              "y": -8478
            },
            {
              "x": 4292,
              "y": -5202
            },
            {
              "x": -2542,
              "y": -6001
            },
            {
              "x": -2760,
              "y": -5720
            },
            {
              "x": 4066,
              "y": -4218
            },
            {
              "x": -7,
              "y": -7629
            }
          ],
          "deathLocation": [
            {
              "x": 4559,
              "y": -4411
            },
            {
              "x": -1250,
              "y": -2536
            },
            {
              "x": -360,
              "y": 978
            },
            {
              "x": 2298,
              "y": -4966
            },
            {
              "x": 2455,
              "y": -2449
            },
            {
              "x": -180,
              "y": -4121
            },
            {
              "x": 2433,
              "y": -3299
            },
            {
              "x": 3108,
              "y": -4886
            },
            {
              "x": 2686,
              "y": -5009
            },
            {
              "x": 5939,
              "y": -6230
            },
            {
              "x": 393,
              "y": -7356
            },
            {
              "x": 2819,
              "y": -5089
            },
            {
              "x": 6401,
              "y": -5653
            },
            {
              "x": 543,
              "y": -5355
            }

          ]
        },
        },
        "defenseStats": {
          "deaths": 18,
          "kills": 88,
          "roundsLost": 14,
          "roundsWon": 18,
          "HeatmapLocation": {
          "killsLocation": [
            {
              "x": 1721,
              "y": -9153
            },
            {
              "x": -4080,
              "y": -7292
            },
            {
              "x": 5888,
              "y": -4959
            },
            {
              "x": 6190,
              "y": -5182
            },
            {
              "x": -884,
              "y": -5988
            },
            {
              "x": -2734,
              "y": -6157
            },
            {
              "x": -1689,
              "y": -6257
            },
            {
              "x": 5710,
              "y": -4956
            },
            {
              "x": -558,
              "y": -4431
            },
            {
              "x": 6031,
              "y": -5342
            },
            {
              "x": 6268,
              "y": -5491
            }
          ],
          "deathLocation": [
            {
              "x": -898,
              "y": -6457
            },
            {
              "x": -1606,
              "y": -7265
            },
            {
              "x": -859,
              "y": -6548
            },
            {
              "x": -996,
              "y": -8306
            },
            {
              "x": -673,
              "y": -6937
            },
            {
              "x": 6452,
              "y": -5961
            },
            {
              "x": 1102,
              "y": -4681
            },
            {
              "x": 5129,
              "y": -6433
            },
            {
              "x": 5730,
              "y": -6922
            },
            {
              "x": -687,
              "y": -7455
            },
            {
              "x": -1999,
              "y": -6638
            },
            {
              "x": -2449,
              "y": -4109
            },
            {
              "x": -911,
              "y": -6644
            },
            {
              "x": 5021,
              "y": -5590
            }
          ]
        },
        },
      },
    ]
  },
];


export const weaponStats: WeaponStatsType[] = [
  {
    "playerId": "-6KG-X-bb86rh70DxTjUWx9S6xayM0iYespoQ-2yKkgzhLgWD0gufwXj779nUGvPV9TNWviIp2fpZA",
    "weapon": {
      "id": "1e58de9c-4950-5125-93e9-a0aee9f98746",
      "name": "Vandal",
      "imageUrl": "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Fvandal.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
      "type": "Rifle",
    },
    "performanceBySeason": [
      {
        "season": {
          "id": "292f58db-4c17-89a7-b1c0-ba988f0e9d98",
          "name": "EPISODE 9 - ACT 2",
          "isActive": false
        },
        "stats": {
          "kills": 58,
          "damage": 37,
          "aces": 24,
          "firstKills": 23,
          "roundsPlayed": 47,
          "avgKillsPerRound": 47,
          "avgDamagePerRound": 47,
          "legshots": 47,
          "headshots": 47,
          "bodyshots": 47
        }
      }
    ]
  }
];


export const seasonStats: SeasonStatsType[] = [
  {
    "season": {
      "id": "292f58db-4c17-89a7-b1c0-ba988f0e9d98",
      "name": "EPISODE 9 - ACT 2",
      "isActive": false,
    },
    "stats": {
      "kills": 58,
      "deaths": 37,
      "roundsWon": 24,
      "roundsLost": 23,
      "totalRounds": 47,
      "plants": 7,
      "defuses": 0,
      "playtimeMillis": 4851242,
      "matchesWon": 1,
      "matchesLost": 1,
      "matchesPlayed": 2,
      "damage": 500,
      "firstKill": 20,
      "highestRank": 1,
      "aces": 0,
      "mvps": 0,
    }
  }
]


export const matchStats: MatchStatsType[] = [
  {
    general: {
      matchId: "match1234",
      mapId: "ascent-123",
      seasonId: "292f58db-4c17-89a7-b1c0-ba988f0e9d98",
      queueId: "competitive",
      gameStartMillis: 1626548700000,
      gameLengthMillis: 2586000,
      isRanked: true,
      winningTeam: "team-alpha",
      roundsPlayed: 24,
      agent: {
        id: "1e58de9c-4950-5125-93e9-a0aee9f98746",
        name: "Breach",
        role: "Initiator",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fbreach.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fbreach_icon.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
        abilities: [
          {
            id: "1e58de9c-4950-5125-93e9-a0aee9f98110",
            name: "Aftershock",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Faftershock.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
            type: "Basic",
            cost: 100
          },
          {
            id: "1e58de9c-4950-5125-93e9-a0aee9f98111",
            name: "Flashpoint",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fflashpoint.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
            type: "Basic",
            cost: 200
          },
          {
            id: "1e58de9c-4950-5125-93e9-a0aee9f98112",
            name: "Fault Line",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Ffaultline.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
            type: "Signature",
            cost: 0
          },
          {
            id: "1e58de9c-4950-5125-93e9-a0aee9f98113",
            name: "Rolling Thunder",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Frollingthunder.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
            type: "Ultimate",
            cost: 7
          }
        ]
      },
      map: {
        id: "1e58de9c-4950-5125-93e9-a0aee9f98746",
        name: "Ascent",
        location: "Italy, Alpha Earth",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
        mapCoordinate: {
          xMultiplier: 0.00007,
          yMultiplier: -0.00007,
          xScalarToAdd: 0.813895,
          yScalarToAdd: 0.573242
        }
      },
      season: {
        id: "292f58db-4c17-89a7-b1c0-ba988f0e9d98",
        name: "EPISODE 9 - ACT 2",
        isActive: false
      }
    },
    playerVsplayerStat: {
      user: {
        id: "player-1234",
        teamId: "team-alpha",
        name: "GamingProXX",
        stats: {
          name: "GamingProXX",
          kills: 18,
          deaths: 12,
          assists: 7,
          firstBloods: 4,
          clutchesWon: 2,
          clutchAttempts: 3,
          headshotPercentage: 38,
          damagePerRound: 142,
          kdRatio: 1.5,
          aces: 0,
          playtimeMillis: 1754000,
          roundsPlayed: 24,
          roundsWon: 13,
          roundsLost: 11
        }
      },
      enemies: [
        {
          id: "enemy-1",
          teamId: "team-beta",
          name: "ValorantMaster99",
          stats: {
            name: "ValorantMaster99",
            kills: 22,
            deaths: 14,
            assists: 5,
            firstBloods: 5,
            clutchesWon: 1,
            clutchAttempts: 2,
            headshotPercentage: 45,
            damagePerRound: 165,
            kdRatio: 1.57,
            aces: 0,
            playtimeMillis: 1754000,
            roundsPlayed: 24,
            roundsWon: 11,
            roundsLost: 13
          }
        },
        {
          id: "enemy-2",
          teamId: "team-beta",
          name: "AimBot42",
          stats: {
            name: "AimBot42",
            kills: 16,
            deaths: 16,
            assists: 9,
            firstBloods: 2,
            clutchesWon: 0,
            clutchAttempts: 1,
            headshotPercentage: 32,
            damagePerRound: 132,
            kdRatio: 1.0,
            aces: 0,
            playtimeMillis: 1754000,
            roundsPlayed: 24,
            roundsWon: 11,
            roundsLost: 13
          }
        },
        {
          id: "enemy-3",
          teamId: "team-beta",
          name: "FlashKing",
          stats: {
            name: "FlashKing",
            kills: 12,
            deaths: 19,
            assists: 12,
            firstBloods: 1,
            clutchesWon: 1,
            clutchAttempts: 3,
            headshotPercentage: 28,
            damagePerRound: 115,
            kdRatio: 0.63,
            aces: 0,
            playtimeMillis: 1754000,
            roundsPlayed: 24,
            roundsWon: 11,
            roundsLost: 13
          }
        },
        {
          id: "enemy-4",
          teamId: "team-beta",
          name: "SniperElite",
          stats: {
            name: "SniperElite",
            kills: 19,
            deaths: 15,
            assists: 4,
            firstBloods: 6,
            clutchesWon: 2,
            clutchAttempts: 4,
            headshotPercentage: 52,
            damagePerRound: 155,
            kdRatio: 1.27,
            aces: 0,
            playtimeMillis: 1754000,
            roundsPlayed: 24,
            roundsWon: 11,
            roundsLost: 13
          }
        }
      ],
      killEvents: [
        { killer: "GamingProXX", victim: "ValorantMaster99", weapon: "Vandal", headshot: true, timestamp: "1:28", round: 1 },
        { killer: "GamingProXX", victim: "AimBot42", weapon: "Vandal", headshot: false, timestamp: "1:42", round: 1 },
        { killer: "SniperElite", victim: "GamingProXX", weapon: "Operator", headshot: true, timestamp: "0:35", round: 2 },
        { killer: "GamingProXX", victim: "FlashKing", weapon: "Sheriff", headshot: true, timestamp: "1:15", round: 3 },
        { killer: "ValorantMaster99", victim: "GamingProXX", weapon: "Phantom", headshot: false, timestamp: "0:48", round: 4 },
        { killer: "GamingProXX", victim: "SniperElite", weapon: "Vandal", headshot: false, timestamp: "1:22", round: 5 },
        { killer: "AimBot42", victim: "GamingProXX", weapon: "Judge", headshot: false, timestamp: "0:25", round: 6 },
        { killer: "GamingProXX", victim: "ValorantMaster99", weapon: "Vandal", headshot: true, timestamp: "1:05", round: 7 },
        { killer: "FlashKing", victim: "GamingProXX", weapon: "Guardian", headshot: true, timestamp: "0:55", round: 8 }
      ],
      clutchEvents: [
        { player: "GamingProXX", situation: "1v2", round: 5, won: true },
        { player: "GamingProXX", situation: "1v3", round: 11, won: true },
        { player: "GamingProXX", situation: "1v2", round: 17, won: false },
        { player: "ValorantMaster99", situation: "1v2", round: 9, won: true },
        { player: "AimBot42", situation: "1v1", round: 15, won: false },
        { player: "FlashKing", situation: "1v2", round: 19, won: true },
        { player: "SniperElite", situation: "1v3", round: 21, won: true }
      ],
      mapData: {
        kills: {
          "enemy-1": [
            { x: 0.35, y: 0.42 },
            { x: 0.58, y: 0.67 },
            { x: 0.22, y: 0.51 }
          ],
          "enemy-2": [
            { x: 0.45, y: 0.32 },
            { x: 0.64, y: 0.55 },
            { x: 0.38, y: 0.72 }
          ],
          "enemy-3": [
            { x: 0.25, y: 0.78 },
            { x: 0.82, y: 0.35 },
            { x: 0.48, y: 0.62 }
          ],
          "enemy-4": [
            { x: 0.72, y: 0.65 },
            { x: 0.43, y: 0.24 },
            { x: 0.65, y: 0.41 }
          ]
        },
        deaths: {
          "enemy-1": [
            { x: 0.28, y: 0.76 },
            { x: 0.47, y: 0.25 },
            { x: 0.62, y: 0.54 }
          ],
          "enemy-2": [
            { x: 0.32, y: 0.68 },
            { x: 0.56, y: 0.34 },
            { x: 0.74, y: 0.59 }
          ],
          "enemy-3": [
            { x: 0.63, y: 0.45 },
            { x: 0.85, y: 0.71 },
            { x: 0.37, y: 0.28 }
          ],
          "enemy-4": [
            { x: 0.52, y: 0.57 },
            { x: 0.31, y: 0.36 },
            { x: 0.69, y: 0.44 }
          ]
        }
      },
      mapCoordinates: {
        xMultiplier: 0.00007,
        yMultiplier: -0.00007,
        xScalarToAdd: 0.813895,
        yScalarToAdd: 0.573242
      }
    },
    teamStats: [
      {
        team: "Alpha Team",
        teamId: "team-alpha",
        firstKills: 8,
        thrifties: 2,
        postPlantsWon: 5,
        postPlantsLost: 2,
        clutchesWon: 3
      },
      {
        team: "Beta Team",
        teamId: "team-beta",
        firstKills: 6,
        thrifties: 1,
        postPlantsWon: 3,
        postPlantsLost: 4,
        clutchesWon: 2
      }
    ],
    roundPerformace: [
      {
        roundNumber: 1,
        outcome: "win",
        impactScore: 87,
        combat: {
          kills: 2,
          deaths: 0,
          assists: 1,
          damageDealt: 278,
          headshotPercentage: 50,
          tradedKill: false,
          tradeKill: true
        },
        economy: {
          weaponType: "Classic",
          armorType: "No Shield",
          creditSpent: 600,
          loadoutValue: 600,
          enemyLoadoutValue: 600
        },
        positioning: {
          site: "A Site",
          positionType: "aggressive",
          firstContact: true,
          timeToFirstContact: 10
        },
        utility: {
          abilitiesUsed: 1,
          totalAbilities: 2,
          utilityDamage: 25
        },
        improvement: ["Consider using utility before engagement"]
      },
      {
        roundNumber: 2,
        outcome: "loss",
        impactScore: 42,
        combat: {
          kills: 0,
          deaths: 1,
          assists: 0,
          damageDealt: 105,
          headshotPercentage: 0,
          tradedKill: true,
          tradeKill: false
        },
        economy: {
          weaponType: "Sheriff",
          armorType: "Light Shield",
          creditSpent: 1600,
          loadoutValue: 1600,
          enemyLoadoutValue: 1900
        },
        positioning: {
          site: "B Site",
          positionType: "defensive",
          firstContact: false,
          timeToFirstContact: 32
        },
        utility: {
          abilitiesUsed: 2,
          totalAbilities: 3,
          utilityDamage: 45
        },
        improvement: ["Better positioning", "Economy management"]
      },
      {
        roundNumber: 3,
        outcome: "win",
        impactScore: 92,
        combat: {
          kills: 1,
          deaths: 0,
          assists: 2,
          damageDealt: 325,
          headshotPercentage: 100,
          tradedKill: false,
          tradeKill: false
        },
        economy: {
          weaponType: "Bulldog",
          armorType: "Heavy Shield",
          creditSpent: 2700,
          loadoutValue: 2700,
          enemyLoadoutValue: 3200
        },
        positioning: {
          site: "Mid",
          positionType: "lurk",
          firstContact: false,
          timeToFirstContact: 25
        },
        utility: {
          abilitiesUsed: 3,
          totalAbilities: 4,
          utilityDamage: 85
        },
        improvement: []
      },
      {
        roundNumber: 4,
        outcome: "win",
        impactScore: 78,
        combat: {
          kills: 2,
          deaths: 1,
          assists: 0,
          damageDealt: 298,
          headshotPercentage: 50,
          tradedKill: false,
          tradeKill: true
        },
        economy: {
          weaponType: "Vandal",
          armorType: "Heavy Shield",
          creditSpent: 3900,
          loadoutValue: 3900,
          enemyLoadoutValue: 3600
        },
        positioning: {
          site: "A Site",
          positionType: "supportive",
          firstContact: false,
          timeToFirstContact: 18
        },
        utility: {
          abilitiesUsed: 4,
          totalAbilities: 4,
          utilityDamage: 120
        },
        improvement: ["Stay alive after entry"]
      }
    ]
  },
  {
    general: {
      matchId: "match5678",
      mapId: "fracture-456",
      seasonId: "392f58db-4c17-89a7-b1c0-ba988f0e9d98",
      queueId: "competitive",
      gameStartMillis: 1652347800000,
      gameLengthMillis: 3012000,
      isRanked: true,
      winningTeam: "team-attackers",
      roundsPlayed: 25,
      agent: {
        id: "4e58de9c-4950-5125-93e9-a0aee9f98746",
        name: "Viper",
        role: "Controller",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fviper.png?alt=media&token=6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d6d",
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fviper_icon.png?alt=media&token=6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d6d",
        abilities: [
          {
            id: "4e58de9c-4950-5125-93e9-a0aee9f98110",
            name: "Snake Bite",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fsnakebite.png?alt=media&token=6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d6d",
            type: "Basic",
            cost: 200
          },
          {
            id: "4e58de9c-4950-5125-93e9-a0aee9f98111",
            name: "Poison Cloud",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fpoisoncloud.png?alt=media&token=6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d6d",
            type: "Basic",
            cost: 200
          },
          {
            id: "4e58de9c-4950-5125-93e9-a0aee9f98112",
            name: "Toxic Screen",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Ftoxicscreen.png?alt=media&token=6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d6d",
            type: "Signature",
            cost: 0
          },
          {
            id: "4e58de9c-4950-5125-93e9-a0aee9f98113",
            name: "Viper's Pit",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fviperspit.png?alt=media&token=6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d6d",
            type: "Ultimate",
            cost: 8
          }
        ]
      },
      map: {
        id: "/Game/Maps/Canyon/Canyon",
        name: "Fracture",
        location: "Santa Fe, United States",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Ffracture.png?alt=media&token=8e8e8e8e-8e8e-8e8e-8e8e-8e8e8e8e8e8e",
        mapCoordinate: {
          xMultiplier: 0.000068,
          yMultiplier: -0.000068,
          xScalarToAdd: 0.825412,
          yScalarToAdd: 0.586157
        }
      },
      season: {
        id: "392f58db-4c17-89a7-b1c0-ba988f0e9d98",
        name: "EPISODE 9 - ACT 3",
        isActive: true
      }
    },
    playerVsplayerStat: {
      user: {
        id: "player-1234",
        teamId: "team-defenders",
        name: "GamingProXX",
        stats: {
          name: "GamingProXX",
          kills: 20,
          deaths: 14,
          assists: 11,
          firstBloods: 5,
          clutchesWon: 2,
          clutchAttempts: 5,
          headshotPercentage: 35,
          damagePerRound: 168,
          kdRatio: 1.43,
          aces: 0,
          playtimeMillis: 2485000,
          roundsPlayed: 25,
          roundsWon: 11,
          roundsLost: 14
        }
      },
      enemies: [
        {
          id: "enemy-13",
          teamId: "team-attackers",
          name: "TacticalGenius",
          stats: {
            name: "TacticalGenius",
            kills: 25,
            deaths: 13,
            assists: 7,
            firstBloods: 7,
            clutchesWon: 3,
            clutchAttempts: 5,
            headshotPercentage: 48,
            damagePerRound: 192,
            kdRatio: 1.92,
            aces: 0,
            playtimeMillis: 2485000,
            roundsPlayed: 25,
            roundsWon: 14,
            roundsLost: 11
          }
        },
        {
          id: "enemy-14",
          teamId: "team-attackers",
          name: "ShadowLurker",
          stats: {
            name: "ShadowLurker",
            kills: 15,
            deaths: 17,
            assists: 14,
            firstBloods: 2,
            clutchesWon: 1,
            clutchAttempts: 3,
            headshotPercentage: 29,
            damagePerRound: 135,
            kdRatio: 0.88,
            aces: 0,
            playtimeMillis: 2485000,
            roundsPlayed: 25,
            roundsWon: 14,
            roundsLost: 11
          }
        },
        {
          id: "enemy-15",
          teamId: "team-attackers",
          name: "RapidFire",
          stats: {
            name: "RapidFire",
            kills: 18,
            deaths: 15,
            assists: 5,
            firstBloods: 4,
            clutchesWon: 2,
            clutchAttempts: 4,
            headshotPercentage: 37,
            damagePerRound: 158,
            kdRatio: 1.2,
            aces: 0,
            playtimeMillis: 2485000,
            roundsPlayed: 25,
            roundsWon: 14,
            roundsLost: 11
          }
        },
        {
          id: "enemy-16",
          teamId: "team-attackers",
          name: "SentinelPro",
          stats: {
            name: "SentinelPro",
            kills: 10,
            deaths: 19,
            assists: 18,
            firstBloods: 1,
            clutchesWon: 0,
            clutchAttempts: 2,
            headshotPercentage: 24,
            damagePerRound: 112,
            kdRatio: 0.53,
            aces: 0,
            playtimeMillis: 2485000,
            roundsPlayed: 25,
            roundsWon: 14,
            roundsLost: 11
          }
        }
      ],
      killEvents: [
        { killer: "GamingProXX", victim: "ShadowLurker", weapon: "Phantom", headshot: true, timestamp: "0:35", round: 1 },
        { killer: "TacticalGenius", victim: "GamingProXX", weapon: "Vandal", headshot: true, timestamp: "1:10", round: 1 },
        { killer: "GamingProXX", victim: "SentinelPro", weapon: "Phantom", headshot: false, timestamp: "0:48", round: 2 },
        { killer: "GamingProXX", victim: "RapidFire", weapon: "Sheriff", headshot: true, timestamp: "1:25", round: 3 },
        { killer: "RapidFire", victim: "GamingProXX", weapon: "Spectre", headshot: false, timestamp: "0:42", round: 4 },
        { killer: "GamingProXX", victim: "TacticalGenius", weapon: "Phantom", headshot: false, timestamp: "1:05", round: 5 },
        { killer: "ShadowLurker", victim: "GamingProXX", weapon: "Odin", headshot: false, timestamp: "0:58", round: 6 },
        { killer: "GamingProXX", victim: "ShadowLurker", weapon: "Marshal", headshot: true, timestamp: "0:29", round: 7 },
        { killer: "TacticalGenius", victim: "GamingProXX", weapon: "Vandal", headshot: true, timestamp: "1:18", round: 8 }
      ],
      clutchEvents: [
        { player: "GamingProXX", situation: "1v2", round: 3, won: true },
        { player: "GamingProXX", situation: "1v3", round: 7, won: false },
        { player: "GamingProXX", situation: "1v1", round: 12, won: true },
        { player: "GamingProXX", situation: "1v2", round: 18, won: false },
        { player: "GamingProXX", situation: "1v1", round: 22, won: false },
        { player: "TacticalGenius", situation: "1v2", round: 9, won: true },
        { player: "TacticalGenius", situation: "1v3", round: 16, won: true },
        { player: "RapidFire", situation: "1v2", round: 14, won: true },
        { player: "ShadowLurker", situation: "1v1", round: 20, won: true }
      ],
      mapData: {
        kills: {
          "enemy-13": [
            { x: 0.38, y: 0.45 },
            { x: 0.62, y: 0.32 },
            { x: 0.51, y: 0.68 }
          ],
          "enemy-14": [
            { x: 0.24, y: 0.55 },
            { x: 0.47, y: 0.75 },
            { x: 0.68, y: 0.38 }
          ],
          "enemy-15": [
            { x: 0.59, y: 0.42 },
            { x: 0.35, y: 0.64 },
            { x: 0.73, y: 0.51 }
          ],
          "enemy-16": [
            { x: 0.42, y: 0.37 },
            { x: 0.65, y: 0.72 },
            { x: 0.28, y: 0.48 }
          ]
        },
        deaths: {
          "enemy-13": [
            { x: 0.45, y: 0.32 },
            { x: 0.67, y: 0.56 },
            { x: 0.39, y: 0.65 }
          ],
          "enemy-14": [
            { x: 0.55, y: 0.41 },
            { x: 0.29, y: 0.68 },
            { x: 0.71, y: 0.49 }
          ],
          "enemy-15": [
            { x: 0.36, y: 0.58 },
            { x: 0.64, y: 0.37 },
            { x: 0.49, y: 0.73 }
          ],
          "enemy-16": [
            { x: 0.58, y: 0.45 },
            { x: 0.32, y: 0.62 },
            { x: 0.75, y: 0.34 }
          ]
        }
      },
      mapCoordinates: {
        xMultiplier: 0.000068,
        yMultiplier: -0.000068,
        xScalarToAdd: 0.825412,
        yScalarToAdd: 0.586157
      }
    },
    teamStats: [
      {
        team: "Defenders",
        teamId: "team-defenders",
        firstKills: 9,
        thrifties: 2,
        postPlantsWon: 4,
        postPlantsLost: 6,
        clutchesWon: 2
      },
      {
        team: "Attackers",
        teamId: "team-attackers",
        firstKills: 15,
        thrifties: 1,
        postPlantsWon: 9,
        postPlantsLost: 3,
        clutchesWon: 4
      }
    ],
    roundPerformace: [
      {
        roundNumber: 1,
        outcome: "loss",
        impactScore: 65,
        combat: {
          kills: 1,
          deaths: 1,
          assists: 0,
          damageDealt: 185,
          headshotPercentage: 100,
          tradedKill: false,
          tradeKill: false
        },
        economy: {
          weaponType: "Phantom",
          armorType: "Heavy Shield",
          creditSpent: 3900,
          loadoutValue: 3900,
          enemyLoadoutValue: 4200
        },
        positioning: {
          site: "A Site",
          positionType: "defensive",
          firstContact: true,
          timeToFirstContact: 15
        },
        utility: {
          abilitiesUsed: 3,
          totalAbilities: 4,
          utilityDamage: 75
        },
        improvement: ["Consider using toxic screen to split site better"]
      },
      {
        roundNumber: 2,
        outcome: "win",
        impactScore: 72,
        combat: {
          kills: 1,
          deaths: 0,
          assists: 2,
          damageDealt: 220,
          headshotPercentage: 0,
          tradedKill: false,
          tradeKill: true
        },
        economy: {
          weaponType: "Phantom",
          armorType: "Heavy Shield",
          creditSpent: 4100,
          loadoutValue: 4100,
          enemyLoadoutValue: 2800
        },
        positioning: {
          site: "B Site",
          positionType: "retake",
          firstContact: false,
          timeToFirstContact: 28
        },
        utility: {
          abilitiesUsed: 4,
          totalAbilities: 4,
          utilityDamage: 120
        },
        improvement: ["Great post-plant utility usage!"]
      },
      {
        roundNumber: 3,
        outcome: "win",
        impactScore: 95,
        combat: {
          kills: 3,
          deaths: 0,
          assists: 0,
          damageDealt: 432,
          headshotPercentage: 33,
          tradedKill: false,
          tradeKill: false
        },
        economy: {
          weaponType: "Sheriff",
          armorType: "Light Shield",
          creditSpent: 1600,
          loadoutValue: 1600,
          enemyLoadoutValue: 4500
        },
        positioning: {
          site: "Mid",
          positionType: "lurk",
          firstContact: false,
          timeToFirstContact: 22
        },
        utility: {
          abilitiesUsed: 3,
          totalAbilities: 4,
          utilityDamage: 85
        },
        improvement: ["Outstanding eco round performance!"]
      },
      {
        roundNumber: 4,
        outcome: "loss",
        impactScore: 28,
        combat: {
          kills: 0,
          deaths: 1,
          assists: 1,
          damageDealt: 78,
          headshotPercentage: 0,
          tradedKill: false,
          tradeKill: false
        },
        economy: {
          weaponType: "Bulldog",
          armorType: "Heavy Shield",
          creditSpent: 2900,
          loadoutValue: 2900,
          enemyLoadoutValue: 3800
        },
        positioning: {
          site: "A Site",
          positionType: "defensive",
          firstContact: false,
          timeToFirstContact: 42
        },
        utility: {
          abilitiesUsed: 2,
          totalAbilities: 4,
          utilityDamage: 45
        },
        improvement: ["Set up crossfire with teammates", "Use abilities to stall pushes"]
      }
    ]
  },
  {
    general: {
      matchId: "match9012",
      mapId: "icebox-789",
      seasonId: "292f58db-4c17-89a7-b1c0-ba988f0e9d99",
      queueId: "competitive",
      gameStartMillis: 1638792400000,
      gameLengthMillis: 2845000,
      isRanked: true,
      winningTeam: "team-omega",
      roundsPlayed: 24,
      agent: {
        id: "5e58de9c-4950-5125-93e9-a0aee9f98746",
        name: "Omen",
        role: "Controller",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fomen.png?alt=media&token=7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e7e",
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fomen_icon.png?alt=media&token=7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e7e",
        abilities: [
          {
            id: "5e58de9c-4950-5125-93e9-a0aee9f98110",
            name: "Paranoia",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fparanoia.png?alt=media&token=7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e7e",
            type: "Basic",
            cost: 300
          },
          {
            id: "5e58de9c-4950-5125-93e9-a0aee9f98111",
            name: "Dark Cover",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fdarkcover.png?alt=media&token=7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e7e",
            type: "Basic",
            cost: 100
          },
          {
            id: "5e58de9c-4950-5125-93e9-a0aee9f98112",
            name: "Shrouded Step",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Fshroudedstep.png?alt=media&token=7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e7e",
            type: "Signature",
            cost: 0
          },
          {
            id: "5e58de9c-4950-5125-93e9-a0aee9f98113",
            name: "From the Shadows",
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/ability%2Ffromtheshadows.png?alt=media&token=7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e7e",
            type: "Ultimate",
            cost: 7
          }
        ]
      },
      map: {
        id: "/Game/Maps/Port/Port",
        name: "Icebox",
        location: "Bennett Island, Russia",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Ficebox.png?alt=media&token=9f9f9f9f-9f9f-9f9f-9f9f-9f9f9f9f9f9f",
        mapCoordinate: {
          xMultiplier: 0.000072,
          yMultiplier: -0.000072,
          xScalarToAdd: 0.795234,
          yScalarToAdd: 0.561872
        }
      },
      season: {
        id: "292f58db-4c17-89a7-b1c0-ba988f0e9d99",
        name: "EPISODE 9 - ACT 3",
        isActive: false
      }
    },
    playerVsplayerStat: {
      user: {
        id: "player-1234",
        teamId: "team-omega",
        name: "GamingProXX",
        stats: {
          name: "GamingProXX",
          kills: 19,
          deaths: 13,
          assists: 9,
          firstBloods: 3,
          clutchesWon: 2,
          clutchAttempts: 4,
          headshotPercentage: 32,
          damagePerRound: 155,
          kdRatio: 1.46,
          aces: 0,
          playtimeMillis: 2105000,
          roundsPlayed: 24,
          roundsWon: 13,
          roundsLost: 11
        }
      },
      enemies: [
        {
          id: "enemy-17",
          teamId: "team-sigma",
          name: "OneShot",
          stats: {
            name: "OneShot",
            kills: 21,
            deaths: 14,
            assists: 6,
            firstBloods: 6,
            clutchesWon: 2,
            clutchAttempts: 4,
            headshotPercentage: 45,
            damagePerRound: 172,
            kdRatio: 1.5,
            aces: 0,
            playtimeMillis: 2105000,
            roundsPlayed: 24,
            roundsWon: 11,
            roundsLost: 13
          }
        },
        {
          id: "enemy-18",
          teamId: "team-sigma",
          name: "SilentFlanker",
          stats: {
            name: "SilentFlanker",
            kills: 17,
            deaths: 16,
            assists: 10,
            firstBloods: 3,
            clutchesWon: 1,
            clutchAttempts: 2,
            headshotPercentage: 38,
            damagePerRound: 144,
            kdRatio: 1.06,
            aces: 0,
            playtimeMillis: 2105000,
            roundsPlayed: 24,
            roundsWon: 11,
            roundsLost: 13
          }
        },
        {
          id: "enemy-19",
          teamId: "team-sigma",
          name: "BombSpecialist",
          stats: {
            name: "BombSpecialist",
            kills: 14,
            deaths: 18,
            assists: 12,
            firstBloods: 2,
            clutchesWon: 0,
            clutchAttempts: 1,
            headshotPercentage: 26,
            damagePerRound: 121,
            kdRatio: 0.78,
            aces: 0,
            playtimeMillis: 2105000,
            roundsPlayed: 24,
            roundsWon: 11,
            roundsLost: 13
          }
        },
        {
          id: "enemy-20",
          teamId: "team-sigma",
          name: "AngleHolder",
          stats: {
            name: "AngleHolder",
            kills: 16,
            deaths: 15,
            assists: 7,
            firstBloods: 4,
            clutchesWon: 3,
            clutchAttempts: 5,
            headshotPercentage: 34,
            damagePerRound: 138,
            kdRatio: 1.07,
            aces: 0,
            playtimeMillis: 2105000,
            roundsPlayed: 24,
            roundsWon: 11,
            roundsLost: 13
          }
        }
      ],
      killEvents: [
        { killer: "GamingProXX", victim: "BombSpecialist", weapon: "Phantom", headshot: true, timestamp: "0:42", round: 1 },
        { killer: "OneShot", victim: "GamingProXX", weapon: "Vandal", headshot: true, timestamp: "1:15", round: 1 },
        { killer: "GamingProXX", victim: "SilentFlanker", weapon: "Ghost", headshot: true, timestamp: "0:35", round: 2 },
        { killer: "GamingProXX", victim: "AngleHolder", weapon: "Phantom", headshot: false, timestamp: "1:28", round: 3 },
        { killer: "BombSpecialist", victim: "GamingProXX", weapon: "Bulldog", headshot: false, timestamp: "0:55", round: 4 },
        { killer: "GamingProXX", victim: "OneShot", weapon: "Phantom", headshot: false, timestamp: "1:10", round: 5 },
        { killer: "AngleHolder", victim: "GamingProXX", weapon: "Sheriff", headshot: true, timestamp: "0:48", round: 6 },
        { killer: "GamingProXX", victim: "BombSpecialist", weapon: "Classic", headshot: true, timestamp: "0:32", round: 7 },
        { killer: "SilentFlanker", victim: "GamingProXX", weapon: "Judge", headshot: false, timestamp: "0:25", round: 8 }
      ],
      clutchEvents: [
        { player: "GamingProXX", situation: "1v2", round: 5, won: true },
        { player: "GamingProXX", situation: "1v3", round: 11, won: false },
        { player: "GamingProXX", situation: "1v2", round: 17, won: true },
        { player: "GamingProXX", situation: "1v2", round: 22, won: false },
        { player: "OneShot", situation: "1v2", round: 8, won: true },
        { player: "OneShot", situation: "1v1", round: 14, won: true },
        { player: "AngleHolder", situation: "1v3", round: 19, won: true },
        { player: "AngleHolder", situation: "1v2", round: 23, won: true }
      ],
      mapData: {
        kills: {
          "enemy-17": [
            { x: 0.42, y: 0.55 },
            { x: 0.68, y: 0.38 },
            { x: 0.35, y: 0.72 }
          ],
          "enemy-18": [
            { x: 0.28, y: 0.45 },
            { x: 0.55, y: 0.68 },
            { x: 0.72, y: 0.41 }
          ],
          "enemy-19": [
            { x: 0.48, y: 0.52 },
            { x: 0.32, y: 0.65 },
            { x: 0.75, y: 0.48 }
          ],
          "enemy-20": [
            { x: 0.62, y: 0.35 },
            { x: 0.41, y: 0.58 },
            { x: 0.82, y: 0.47 }
          ]
        },
        deaths: {
          "enemy-17": [
            { x: 0.38, y: 0.48 },
            { x: 0.62, y: 0.65 },
            { x: 0.45, y: 0.32 }
          ],
          "enemy-18": [
            { x: 0.55, y: 0.42 },
            { x: 0.28, y: 0.61 },
            { x: 0.71, y: 0.55 }
          ],
          "enemy-19": [
            { x: 0.42, y: 0.75 },
            { x: 0.66, y: 0.48 },
            { x: 0.38, y: 0.32 }
          ],
          "enemy-20": [
            { x: 0.58, y: 0.38 },
            { x: 0.45, y: 0.65 },
            { x: 0.75, y: 0.52 }
          ]
        }
      },
      mapCoordinates: {
        xMultiplier: 0.000072,
        yMultiplier: -0.000072,
        xScalarToAdd: 0.795234,
        yScalarToAdd: 0.561872
      }
    },
    teamStats: [
      {
        team: "Team Omega",
        teamId: "team-omega",
        firstKills: 10,
        thrifties: 2,
        postPlantsWon: 6,
        postPlantsLost: 4,
        clutchesWon: 4
      },
      {
        team: "Team Sigma",
        teamId: "team-sigma",
        firstKills: 13,
        thrifties: 3,
        postPlantsWon: 7,
        postPlantsLost: 2,
        clutchesWon: 5
      }
    ],
    roundPerformace: [
      {
        roundNumber: 1,
        outcome: "loss",
        impactScore: 65,
        combat: {
          kills: 1,
          deaths: 1,
          assists: 0,
          damageDealt: 185,
          headshotPercentage: 100,
          tradedKill: false,
          tradeKill: false
        },
        economy: {
          weaponType: "Phantom",
          armorType: "Heavy Shield",
          creditSpent: 3900,
          loadoutValue: 3900,
          enemyLoadoutValue: 4200
        },
        positioning: {
          site: "A Site",
          positionType: "defensive",
          firstContact: true,
          timeToFirstContact: 15
        },
        utility: {
          abilitiesUsed: 3,
          totalAbilities: 4,
          utilityDamage: 75
        },
        improvement: ["Consider using toxic screen to split site better"]
      },
      {
        roundNumber: 2,
        outcome: "win",
        impactScore: 72,
        combat: {
          kills: 1,
          deaths: 0,
          assists: 2,
          damageDealt: 220,
          headshotPercentage: 0,
          tradedKill: false,
          tradeKill: true
        },
        economy: {
          weaponType: "Phantom",
          armorType: "Heavy Shield",
          creditSpent: 4100,
          loadoutValue: 4100,
          enemyLoadoutValue: 2800
        },
        positioning: {
          site: "B Site",
          positionType: "retake",
          firstContact: false,
          timeToFirstContact: 28
        },
        utility: {
          abilitiesUsed: 4,
          totalAbilities: 4,
          utilityDamage: 120
        },
        improvement: ["Great post-plant utility usage!"]
      },
      {
        roundNumber: 3,
        outcome: "win",
        impactScore: 95,
        combat: {
          kills: 3,
          deaths: 0,
          assists: 0,
          damageDealt: 432,
          headshotPercentage: 33,
          tradedKill: false,
          tradeKill: false
        },
        economy: {
          weaponType: "Sheriff",
          armorType: "Light Shield",
          creditSpent: 1600,
          loadoutValue: 1600,
          enemyLoadoutValue: 4500
        },
        positioning: {
          site: "Mid",
          positionType: "lurk",
          firstContact: false,
          timeToFirstContact: 22
        },
        utility: {
          abilitiesUsed: 3,
          totalAbilities: 4,
          utilityDamage: 85
        },
        improvement: ["Outstanding eco round performance!"]
      },
      {
        roundNumber: 4,
        outcome: "loss",
        impactScore: 28,
        combat: {
          kills: 0,
          deaths: 1,
          assists: 1,
          damageDealt: 78,
          headshotPercentage: 0,
          tradedKill: false,
          tradeKill: false
        },
        economy: {
          weaponType: "Bulldog",
          armorType: "Heavy Shield",
          creditSpent: 2900,
          loadoutValue: 2900,
          enemyLoadoutValue: 3800
        },
        positioning: {
          site: "A Site",
          positionType: "defensive",
          firstContact: false,
          timeToFirstContact: 42
        },
        utility: {
          abilitiesUsed: 2,
          totalAbilities: 4,
          utilityDamage: 45
        },
        improvement: ["Set up crossfire with teammates", "Use abilities to stall pushes"]
      }
    ]
  }
]