export const playoffsPageFixture = {
  data: {
    type: "alpha",
    season: 11,
    players: [
      {
        uuid: "635f35ee69ed4f0c94ff26ece4818956",
        nickname: "edcr",
        seasonEloRate: 2688,
        seasonEloRank: 1,
        seedNumber: 1,
        personalBest: 434_617,
      },
      {
        uuid: "aa5a894a4d5340f49683fdfd1ea9c523",
        nickname: "doogile",
        seasonEloRate: null,
        seasonEloRank: null,
        seedNumber: 2,
        personalBest: null,
      },
    ],
    matches: [
      {
        id: 16,
        name: "Grand Finals",
        nextMatchId: null,
        maxRoundScore: 4,
        startTime: 1_788_134_400,
        state: "DONE",
        participants: [
          { player: 0, roundScore: 4 },
          { player: 1, roundScore: 2 },
        ],
        vod: "https://youtu.be/example",
      },
      {
        id: 15,
        name: "Quarterfinals",
        nextMatchId: 16,
        maxRoundScore: 3,
        startTime: null,
        state: null,
        participants: [{ player: 1, roundScore: null }],
        vod: null,
      },
    ],
    results: [
      { player: 0, place: 1, prize: 5000 },
      { player: null, place: 2, prize: 2500 },
    ],
  },
  next: null,
  prev: 10,
};
