import * as v from "valibot";

const integer = v.pipe(v.number(), v.integer());
const nullableInteger = v.nullable(integer);

export const playoffPlayerSchema = v.object({
  uuid: v.string(),
  nickname: v.string(),
  seasonEloRate: nullableInteger,
  seasonEloRank: nullableInteger,
  seedNumber: integer,
  personalBest: nullableInteger,
});

export const playoffMatchSchema = v.object({
  id: integer,
  name: v.string(),
  nextMatchId: nullableInteger,
  maxRoundScore: integer,
  startTime: nullableInteger,
  state: v.nullable(v.string()),
  participants: v.array(
    v.object({
      player: nullableInteger,
      roundScore: nullableInteger,
    }),
  ),
  vod: v.nullable(v.string()),
});

export const playoffsSchema = v.object({
  type: v.string(),
  season: integer,
  players: v.array(playoffPlayerSchema),
  matches: v.array(playoffMatchSchema),
  results: v.array(
    v.object({
      player: nullableInteger,
      place: integer,
      prize: integer,
    }),
  ),
});

export const playoffsPageSchema = v.object({
  data: playoffsSchema,
  next: nullableInteger,
  prev: nullableInteger,
});

export type PlayoffPlayer = v.InferOutput<typeof playoffPlayerSchema>;
export type PlayoffMatch = v.InferOutput<typeof playoffMatchSchema>;
export type Playoffs = v.InferOutput<typeof playoffsSchema>;
export type PlayoffsPage = v.InferOutput<typeof playoffsPageSchema>;
