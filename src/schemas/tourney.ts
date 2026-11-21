import * as v from "valibot";

const integer = v.pipe(v.number(), v.integer());
const nullableInteger = v.nullable(integer);

export const tourneyCompletionSchema = v.object({
  place: integer,
  score: integer,
});

export const tourneyEntrySchema = v.object({
  rank: integer,
  prevRank: integer,
  uuid: v.string(),
  completions: v.array(v.nullable(v.union([tourneyCompletionSchema, integer]))),
  point: integer,
  bonus: v.optional(integer),
  eliminated: v.boolean(),
});

export const tourneyPlayerSchema = v.object({
  uuid: v.string(),
  nickname: v.string(),
  roleType: integer,
  eloRate: nullableInteger,
  eloRank: nullableInteger,
  country: v.nullable(v.string()),
});

export const tourneySchema = v.object({
  matches: v.array(integer),
  currentRound: integer,
  brackets: v.array(tourneyEntrySchema),
  players: v.array(tourneyPlayerSchema),
});

export type TourneyCompletion = v.InferOutput<typeof tourneyCompletionSchema>;
export type TourneyEntry = v.InferOutput<typeof tourneyEntrySchema>;
export type TourneyPlayer = v.InferOutput<typeof tourneyPlayerSchema>;
export type Tourney = v.InferOutput<typeof tourneySchema>;
