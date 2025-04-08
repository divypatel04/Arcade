import { MapStatsType } from "../types/MapStatsType";

const mapStats: MapStatsType[] = [
  {
    playerId: "player-12345",
    map: {
      id: "map-001",
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
    performanceBySeason: [
      {
        season: {
          id: "s1",
          name: "Episode 1: Ignition",
          isActive: false
        },
        stats: {
          kills: 178,
          deaths: 145,
          roundsWon: 67,
          roundsLost: 54,
          totalRounds: 121,
          plants: 32,
          defuses: 21,
          playtimeMillis: 239400000,
          matchesWon: 12,
          matchesLost: 8,
          aces: 2,
          firstKills: 23
        },
        attackStats: {
          deaths: 76,
          kills: 89,
          roundsLost: 30,
          roundsWon: 38,
          HeatmapLocation: {
            killsLocation: [
              { x: 234, y: 156 },
              { x: 345, y: 278 },
              { x: 123, y: 432 }
            ],
            deathLocation: [
              { x: 256, y: 187 },
              { x: 423, y: 312 }
            ]
          }
        },
        defenseStats: {
          deaths: 69,
          kills: 89,
          roundsLost: 24,
          roundsWon: 29,
          HeatmapLocation: {
            killsLocation: [
              { x: 456, y: 234 },
              { x: 234, y: 345 }
            ],
            deathLocation: [
              { x: 345, y: 123 },
              { x: 234, y: 345 }
            ]
          }
        }
      },
      {
        season: {
          id: "s2",
          name: "Episode 1: Act 2",
          isActive: false
        },
        stats: {
          kills: 203,
          deaths: 167,
          roundsWon: 78,
          roundsLost: 65,
          totalRounds: 143,
          plants: 38,
          defuses: 27,
          playtimeMillis: 285600000,
          matchesWon: 15,
          matchesLost: 10,
          aces: 3,
          firstKills: 29
        },
        attackStats: {
          deaths: 88,
          kills: 101,
          roundsLost: 34,
          roundsWon: 42,
          HeatmapLocation: {
            killsLocation: [
              { x: 123, y: 456 },
              { x: 234, y: 345 }
            ],
            deathLocation: [
              { x: 345, y: 234 },
              { x: 456, y: 123 }
            ]
          }
        },
        defenseStats: {
          deaths: 79,
          kills: 102,
          roundsLost: 31,
          roundsWon: 36,
          HeatmapLocation: {
            killsLocation: [
              { x: 567, y: 345 },
              { x: 678, y: 234 }
            ],
            deathLocation: [
              { x: 789, y: 123 },
              { x: 890, y: 345 }
            ]
          }
        }
      }
    ]
  },
  {
    playerId: "player-12345",
    map: {
      id: "map-002",
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
    performanceBySeason: [
      {
        season: {
          id: "s1",
          name: "Episode 1: Ignition",
          isActive: false
        },
        stats: {
          kills: 156,
          deaths: 134,
          roundsWon: 58,
          roundsLost: 51,
          totalRounds: 109,
          plants: 27,
          defuses: 18,
          playtimeMillis: 217800000,
          matchesWon: 10,
          matchesLost: 9,
          aces: 1,
          firstKills: 19
        },
        attackStats: {
          deaths: 70,
          kills: 76,
          roundsLost: 28,
          roundsWon: 29,
          HeatmapLocation: {
            killsLocation: [
              { x: 111, y: 222 },
              { x: 333, y: 444 }
            ],
            deathLocation: [
              { x: 555, y: 666 },
              { x: 777, y: 888 }
            ]
          }
        },
        defenseStats: {
          deaths: 64,
          kills: 80,
          roundsLost: 23,
          roundsWon: 29,
          HeatmapLocation: {
            killsLocation: [
              { x: 123, y: 321 },
              { x: 456, y: 654 }
            ],
            deathLocation: [
              { x: 789, y: 987 },
              { x: 246, y: 642 }
            ]
          }
        }
      }
    ]
  },
  {
    playerId: "player-12345",
    map: {
      id: "map-003",
      name: "Split",
      location: "Japan",
      imageUrl: "/images/maps/split.jpg",
      mapCoordinate: {
        xMultiplier: 0.079,
        yMultiplier: 0.082,
        xScalarToAdd: 0,
        yScalarToAdd: 0
      }
    },
    performanceBySeason: [
      {
        season: {
          id: "s2",
          name: "Episode 1: Act 2",
          isActive: false
        },
        stats: {
          kills: 187,
          deaths: 155,
          roundsWon: 72,
          roundsLost: 61,
          totalRounds: 133,
          plants: 35,
          defuses: 22,
          playtimeMillis: 266000000,
          matchesWon: 13,
          matchesLost: 11,
          aces: 2,
          firstKills: 26
        },
        attackStats: {
          deaths: 83,
          kills: 91,
          roundsLost: 33,
          roundsWon: 35,
          HeatmapLocation: {
            killsLocation: [
              { x: 135, y: 246 },
              { x: 357, y: 468 }
            ],
            deathLocation: [
              { x: 579, y: 680 },
              { x: 791, y: 802 }
            ]
          }
        },
        defenseStats: {
          deaths: 72,
          kills: 96,
          roundsLost: 28,
          roundsWon: 37,
          HeatmapLocation: {
            killsLocation: [
              { x: 147, y: 258 },
              { x: 369, y: 470 }
            ],
            deathLocation: [
              { x: 581, y: 692 },
              { x: 703, y: 814 }
            ]
          }
        }
      }
    ]
  },
  {
    playerId: "player-12345",
    map: {
      id: "map-004",
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
    performanceBySeason: [
      {
        season: {
          id: "s2",
          name: "Episode 1: Act 2",
          isActive: false
        },
        stats: {
          kills: 195,
          deaths: 162,
          roundsWon: 75,
          roundsLost: 63,
          totalRounds: 138,
          plants: 36,
          defuses: 24,
          playtimeMillis: 276000000,
          matchesWon: 14,
          matchesLost: 10,
          aces: 3,
          firstKills: 28
        },
        attackStats: {
          deaths: 85,
          kills: 98,
          roundsLost: 34,
          roundsWon: 38,
          HeatmapLocation: {
            killsLocation: [
              { x: 159, y: 260 },
              { x: 361, y: 462 }
            ],
            deathLocation: [
              { x: 563, y: 664 },
              { x: 765, y: 866 }
            ]
          }
        },
        defenseStats: {
          deaths: 77,
          kills: 97,
          roundsLost: 29,
          roundsWon: 37,
          HeatmapLocation: {
            killsLocation: [
              { x: 167, y: 268 },
              { x: 369, y: 470 }
            ],
            deathLocation: [
              { x: 571, y: 672 },
              { x: 773, y: 874 }
            ]
          }
        }
      },
      {
        season: {
          id: "s3",
          name: "Episode 1: Act 3",
          isActive: true
        },
        stats: {
          kills: 210,
          deaths: 175,
          roundsWon: 82,
          roundsLost: 68,
          totalRounds: 150,
          plants: 40,
          defuses: 28,
          playtimeMillis: 300000000,
          matchesWon: 16,
          matchesLost: 11,
          aces: 4,
          firstKills: 32
        },
        attackStats: {
          deaths: 92,
          kills: 105,
          roundsLost: 36,
          roundsWon: 41,
          HeatmapLocation: {
            killsLocation: [
              { x: 171, y: 272 },
              { x: 373, y: 474 }
            ],
            deathLocation: [
              { x: 575, y: 676 },
              { x: 777, y: 878 }
            ]
          }
        },
        defenseStats: {
          deaths: 83,
          kills: 105,
          roundsLost: 32,
          roundsWon: 41,
          HeatmapLocation: {
            killsLocation: [
              { x: 179, y: 280 },
              { x: 381, y: 482 }
            ],
            deathLocation: [
              { x: 583, y: 684 },
              { x: 785, y: 886 }
            ]
          }
        }
      }
    ]
  },
  {
    playerId: "player-12345",
    map: {
      id: "map-005",
      name: "Icebox",
      location: "Russia",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Ficebox.png?alt=media&token=95f99ad7-a97c-47dd-aebf-b851f9df585b"	,
      mapCoordinate: {
        xMultiplier: 0.000072,
        yMultiplier: -0.000072,
        xScalarToAdd: 0.460214,
        yScalarToAdd: 0.304687
      }
    },
    performanceBySeason: [
      {
        season: {
          id: "s3",
          name: "Episode 1: Act 3",
          isActive: true
        },
        stats: {
          kills: 168,
          deaths: 149,
          roundsWon: 65,
          roundsLost: 58,
          totalRounds: 123,
          plants: 31,
          defuses: 20,
          playtimeMillis: 246000000,
          matchesWon: 11,
          matchesLost: 10,
          aces: 2,
          firstKills: 22
        },
        attackStats: {
          deaths: 78,
          kills: 84,
          roundsLost: 31,
          roundsWon: 33,
          HeatmapLocation: {
            killsLocation: [
              { x: 183, y: 284 },
              { x: 385, y: 486 }
            ],
            deathLocation: [
              { x: 587, y: 688 },
              { x: 789, y: 890 }
            ]
          }
        },
        defenseStats: {
          deaths: 71,
          kills: 84,
          roundsLost: 27,
          roundsWon: 32,
          HeatmapLocation: {
            killsLocation: [
              { x: 191, y: 292 },
              { x: 393, y: 494 }
            ],
            deathLocation: [
              { x: 595, y: 696 },
              { x: 797, y: 898 }
            ]
          }
        }
      }
    ]
  }
];

export default mapStats;