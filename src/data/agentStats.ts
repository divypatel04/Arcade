import { AgentStatType } from "../types/AgentStatsType";

export const agentStats: AgentStatType[] = [
  {
    playerId: "player-001",
    agent: {
      id: "jett",
      name: "Jett",
      role: "Duelist",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fjett.webp?alt=media&token=f673816a-e3f9-493e-9684-f70c382fc4b8",
      iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agentIcon%2Fjett_icon.jpg?alt=media&token=209c5da4-cee3-4fdb-bdab-b03788ac37ec",
      abilities: [
        { id: "updraft", name: "Updraft", imageUrl: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/ability1/displayicon.png", type: "basic", cost: 150 },
        { id: "tailwind", name: "Tailwind", imageUrl: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/ability2/displayicon.png", type: "signature", cost: 0 },
        { id: "cloudburst", name: "Cloudburst", imageUrl: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/grenade/displayicon.png", type: "basic", cost: 200 },
        { id: "bladestorm", name: "Blade Storm", imageUrl: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/ultimate/displayicon.png", type: "ultimate", cost: 7 }
      ]
    },
    performanceBySeason: [
      {
        season: {
          id: "s1",
          name: "Episode 1 Act 1",
          isActive: false
        },
        stats: {
          kills: 342,
          deaths: 198,
          roundsWon: 145,
          roundsLost: 110,
          totalRounds: 255,
          plants: 23,
          defuses: 5,
          playtimeMillis: 982500000,
          matchesWon: 18,
          matchesLost: 12,
          aces: 3,
          firstKills: 67
        },
        mapStats: [
          { id: "ascent", imageUrl: "/maps/ascent.png", name: "Ascent", location: "Italy", wins: 7, losses: 3 },
          { id: "bind", imageUrl: "/maps/bind.png", name: "Bind", location: "Morocco", wins: 6, losses: 5 },
          { id: "haven", imageUrl: "/maps/haven.png", name: "Haven", location: "Bhutan", wins: 5, losses: 4 }
        ],
        attackStats: {
          deaths: 98,
          kills: 175,
          roundsLost: 52,
          roundsWon: 78,
          clutchStats: {
            "1v1Wins": 12,
            "1v2Wins": 5,
            "1v3Wins": 2,
            "1v4Wins": 1,
            "1v5Wins": 0
          }
        },
        defenseStats: {
          deaths: 100,
          kills: 167,
          roundsLost: 58,
          roundsWon: 67,
          clutchStats: {
            "1v1Wins": 10,
            "1v2Wins": 3,
            "1v3Wins": 1,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        abilityAndUltimateImpact: [
          { type: "basic", id: "updraft", count: 125, kills: 18, damage: 1240 },
          { type: "signature", id: "tailwind", count: 230, kills: 0, damage: 0 },
          { type: "basic", id: "cloudburst", count: 180, kills: 3, damage: 250 },
          { type: "ultimate", id: "bladestorm", count: 35, kills: 42, damage: 4200 }
        ]
      }
    ]
  },
  {
    playerId: "player-002",
    agent: {
      id: "sage",
      name: "Sage",
      role: "Sentinel",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fsage.webp?alt=media&token=1bb710cd-d9f2-42aa-80d8-f53863a130ae"	,
      iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agentIcon%2Fsage_icon.jpg?alt=media&token=74ee511d-63b3-4824-a354-87913d78423a",
      abilities: [
        { id: "slow-orb", name: "Slow Orb", imageUrl: "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ability1/displayicon.png", type: "basic", cost: 200 },
        { id: "healing-orb", name: "Healing Orb", imageUrl: "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ability2/displayicon.png", type: "signature", cost: 0 },
        { id: "barrier-orb", name: "Barrier Orb", imageUrl: "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/grenade/displayicon.png", type: "basic", cost: 400 },
        { id: "resurrection", name: "Resurrection", imageUrl: "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ultimate/displayicon.png", type: "ultimate", cost: 8 }
      ]
    },
    performanceBySeason: [
      {
        season: {
          id: "s2",
          name: "Episode 1 Act 2",
          isActive: false
        },
        stats: {
          kills: 210,
          deaths: 185,
          roundsWon: 156,
          roundsLost: 124,
          totalRounds: 280,
          plants: 12,
          defuses: 28,
          playtimeMillis: 1052000000,
          matchesWon: 20,
          matchesLost: 15,
          aces: 1,
          firstKills: 22
        },
        mapStats: [
          { id: "icebox", imageUrl: "/maps/icebox.png", name: "Icebox", location: "Russia", wins: 8, losses: 5 },
          { id: "split", imageUrl: "/maps/split.png", name: "Split", location: "Japan", wins: 9, losses: 6 },
          { id: "bind", imageUrl: "/maps/bind.png", name: "Bind", location: "Morocco", wins: 3, losses: 4 }
        ],
        attackStats: {
          deaths: 105,
          kills: 87,
          roundsLost: 72,
          roundsWon: 68,
          clutchStats: {
            "1v1Wins": 8,
            "1v2Wins": 3,
            "1v3Wins": 0,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        defenseStats: {
          deaths: 80,
          kills: 123,
          roundsLost: 52,
          roundsWon: 88,
          clutchStats: {
            "1v1Wins": 12,
            "1v2Wins": 6,
            "1v3Wins": 2,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        abilityAndUltimateImpact: [
          { type: "basic", id: "slow-orb", count: 245, kills: 15, damage: 860 },
          { type: "signature", id: "healing-orb", count: 320, kills: 0, damage: 0 },
          { type: "basic", id: "barrier-orb", count: 175, kills: 5, damage: 320 },
          { type: "ultimate", id: "resurrection", count: 32, kills: 0, damage: 0 }
        ]
      }
    ]
  },
  {
    playerId: "player-003",
    agent: {
      id: "sova",
      name: "Sova",
      role: "Initiator",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fsova.webp?alt=media&token=c87d1ec4-bb3f-46f4-b552-a8b54eed257c"	,
      iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agentIcon%2Fsova_icon.jpg?alt=media&token=59ba8ffc-5a09-4fb7-aa7d-3da32e4096eb",
      abilities: [
        { id: "shock-bolt", name: "Shock Bolt", imageUrl: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ability1/displayicon.png", type: "basic", cost: 150 },
        { id: "recon-bolt", name: "Recon Bolt", imageUrl: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ability2/displayicon.png", type: "signature", cost: 0 },
        { id: "owl-drone", name: "Owl Drone", imageUrl: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/grenade/displayicon.png", type: "basic", cost: 400 },
        { id: "hunters-fury", name: "Hunter's Fury", imageUrl: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ultimate/displayicon.png", type: "ultimate", cost: 8 }
      ]
    },
    performanceBySeason: [
      {
        season: {
          id: "s3",
          name: "Episode 1 Act 3",
          isActive: true
        },
        stats: {
          kills: 285,
          deaths: 201,
          roundsWon: 165,
          roundsLost: 140,
          totalRounds: 305,
          plants: 15,
          defuses: 18,
          playtimeMillis: 1150000000,
          matchesWon: 22,
          matchesLost: 16,
          aces: 2,
          firstKills: 45
        },
        mapStats: [
          { id: "ascent", imageUrl: "/maps/ascent.png", name: "Ascent", location: "Italy", wins: 9, losses: 5 },
          { id: "haven", imageUrl: "/maps/haven.png", name: "Haven", location: "Bhutan", wins: 8, losses: 6 },
          { id: "icebox", imageUrl: "/maps/icebox.png", name: "Icebox", location: "Russia", wins: 5, losses: 5 }
        ],
        attackStats: {
          deaths: 95,
          kills: 152,
          roundsLost: 62,
          roundsWon: 88,
          clutchStats: {
            "1v1Wins": 14,
            "1v2Wins": 6,
            "1v3Wins": 2,
            "1v4Wins": 1,
            "1v5Wins": 0
          }
        },
        defenseStats: {
          deaths: 106,
          kills: 133,
          roundsLost: 78,
          roundsWon: 77,
          clutchStats: {
            "1v1Wins": 11,
            "1v2Wins": 4,
            "1v3Wins": 1,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        abilityAndUltimateImpact: [
          { type: "basic", id: "shock-bolt", count: 310, kills: 42, damage: 7850 },
          { type: "signature", id: "recon-bolt", count: 345, kills: 8, damage: 420 },
          { type: "basic", id: "owl-drone", count: 165, kills: 5, damage: 280 },
          { type: "ultimate", id: "hunters-fury", count: 40, kills: 52, damage: 6200 }
        ]
      }
    ]
  },
  {
    playerId: "player-004",
    agent: {
      id: "brimstone",
      name: "Brimstone",
      role: "Controller",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fbrimstone.webp?alt=media&token=a79167f4-326b-4184-bf1c-7f8f2129116a"	,
      iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agentIcon%2Fbrimstone_icon.jpg?alt=media&token=bc9d7d54-da81-4719-8bf1-bcb0e1730903"	,
      abilities: [
        { id: "incendiary", name: "Incendiary", imageUrl: "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/grenade/displayicon.png", type: "basic", cost: 250 },
        { id: "sky-smoke", name: "Sky Smoke", imageUrl: "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/ability1/displayicon.png", type: "signature", cost: 0 },
        { id: "stim-beacon", name: "Stim Beacon", imageUrl: "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/ability2/displayicon.png", type: "basic", cost: 100 },
        { id: "orbital-strike", name: "Orbital Strike", imageUrl: "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/ultimate/displayicon.png", type: "ultimate", cost: 7 }
      ]
    },
    performanceBySeason: [
      {
        season: {
          id: "s4",
          name: "Episode 2 Act 1",
          isActive: false
        },
        stats: {
          kills: 254,
          deaths: 220,
          roundsWon: 152,
          roundsLost: 145,
          totalRounds: 297,
          plants: 42,
          defuses: 8,
          playtimeMillis: 1085000000,
          matchesWon: 19,
          matchesLost: 17,
          aces: 1,
          firstKills: 25
        },
        mapStats: [
          { id: "bind", imageUrl: "/maps/bind.png", name: "Bind", location: "Morocco", wins: 7, losses: 5 },
          { id: "split", imageUrl: "/maps/split.png", name: "Split", location: "Japan", wins: 6, losses: 7 },
          { id: "haven", imageUrl: "/maps/haven.png", name: "Haven", location: "Bhutan", wins: 6, losses: 5 }
        ],
        attackStats: {
          deaths: 120,
          kills: 142,
          roundsLost: 75,
          roundsWon: 85,
          clutchStats: {
            "1v1Wins": 9,
            "1v2Wins": 3,
            "1v3Wins": 1,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        defenseStats: {
          deaths: 100,
          kills: 112,
          roundsLost: 70,
          roundsWon: 67,
          clutchStats: {
            "1v1Wins": 7,
            "1v2Wins": 2,
            "1v3Wins": 0,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        abilityAndUltimateImpact: [
          { type: "basic", id: "incendiary", count: 240, kills: 38, damage: 5640 },
          { type: "signature", id: "sky-smoke", count: 585, kills: 12, damage: 350 },
          { type: "basic", id: "stim-beacon", count: 180, kills: 0, damage: 0 },
          { type: "ultimate", id: "orbital-strike", count: 36, kills: 42, damage: 7850 }
        ]
      }
    ]
  },
  {
    playerId: "player-005",
    agent: {
      id: "killjoy",
      name: "Killjoy",
      role: "Sentinel",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fkj.webp?alt=media&token=9dbd0a70-3c15-4d3e-b351-33bd13b4108d"	,
      iconUrl: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agentIcon%2Fkj_icon.jpg?alt=media&token=981f6e28-9b70-4a5a-a5d9-be62c5770fe8"	,
      abilities: [
        { id: "alarmbot", name: "Alarmbot", imageUrl: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/ability1/displayicon.png", type: "basic", cost: 200 },
        { id: "turret", name: "Turret", imageUrl: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/ability2/displayicon.png", type: "signature", cost: 0 },
        { id: "nanoswarm", name: "Nanoswarm", imageUrl: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/grenade/displayicon.png", type: "basic", cost: 200 },
        { id: "lockdown", name: "Lockdown", imageUrl: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/ultimate/displayicon.png", type: "ultimate", cost: 8 }
      ]
    },
    performanceBySeason: [
      {
        season: {
          id: "s5",
          name: "Episode 2 Act 2",
          isActive: true
        },
        stats: {
          kills: 268,
          deaths: 195,
          roundsWon: 170,
          roundsLost: 130,
          totalRounds: 300,
          plants: 14,
          defuses: 32,
          playtimeMillis: 1120000000,
          matchesWon: 23,
          matchesLost: 13,
          aces: 1,
          firstKills: 18
        },
        mapStats: [
          { id: "icebox", imageUrl: "/maps/icebox.png", name: "Icebox", location: "Russia", wins: 9, losses: 4 },
          { id: "bind", imageUrl: "/maps/bind.png", name: "Bind", location: "Morocco", wins: 8, losses: 4 },
          { id: "ascent", imageUrl: "/maps/ascent.png", name: "Ascent", location: "Italy", wins: 6, losses: 5 }
        ],
        attackStats: {
          deaths: 110,
          kills: 115,
          roundsLost: 70,
          roundsWon: 75,
          clutchStats: {
            "1v1Wins": 10,
            "1v2Wins": 4,
            "1v3Wins": 1,
            "1v4Wins": 0,
            "1v5Wins": 0
          }
        },
        defenseStats: {
          deaths: 85,
          kills: 153,
          roundsLost: 60,
          roundsWon: 95,
          clutchStats: {
            "1v1Wins": 15,
            "1v2Wins": 7,
            "1v3Wins": 3,
            "1v4Wins": 1,
            "1v5Wins": 0
          }
        },
        abilityAndUltimateImpact: [
          { type: "basic", id: "alarmbot", count: 185, kills: 28, damage: 3650 },
          { type: "signature", id: "turret", count: 210, kills: 35, damage: 4200 },
          { type: "basic", id: "nanoswarm", count: 240, kills: 45, damage: 6800 },
          { type: "ultimate", id: "lockdown", count: 32, kills: 5, damage: 450 }
        ]
      }
    ]
  }
];

export default agentStats;