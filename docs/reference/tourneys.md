# Tourneys

Use `tourneys` to get standings for the points-based qualifier events. These
routes aren't in the official API docs. The SDK's schema comes from live
responses for every ID the MCSR Ranked site requests, so it may change
without notice.

## `tourneys.get()`

Gets a tourney by its string ID.

```ts
tourneys.get(id: TourneyId): Promise<Tourney>
```

| Parameter | Type        | Description |
| --------- | ----------- | ----------- |
| `id`      | `TourneyId` | Tourney ID  |

```ts
const showdown = await mcsrranked.tourneys.get("showdown_s11");
const qualifiers = await mcsrranked.tourneys.get("qualifiers_s10");
const worlds = await mcsrranked.tourneys.get("wc_2026");
```

The IDs the official site uses are:

| Event                         | ID pattern      | Seasons with data |
| ----------------------------- | --------------- | ----------------- |
| Midseason Showdown            | `showdown_sN`   | 4 to 11           |
| Last Chance Qualifiers        | `qualifiers_sN` | 6 to 11           |
| World Championship Qualifiers | `wc_2026`       | n/a               |

The qualifier suffix names the season the event is for, so the matches in
`qualifiers_s10` are played in season 11. An unknown ID, or an event that hasn't
started, fails with an HTTP 400 `RankedError` whose message is
`not updated data`.

## Response shape

A tourney runs over a fixed number of rounds. In each round, the remaining
players race in the same match and earn points based on where they finish.
A `Tourney` gives you the current standings, each player's result in every
round, and the match ID of each round played so far.

### `Tourney`

| Field | Type | Description |
| --- | --- | --- |
| `matches` | `number[]` | Match IDs of the rounds that have started, in round order. Pass one to [`matches.get()`](matches.md) for the full match |
| `currentRound` | `number` | The round in progress, starting at 1. After the last round, it's one higher than the number of rounds |
| `brackets` | `TourneyEntry[]` | The standings, sorted by `rank` |
| `players` | `TourneyPlayer[]` | Profile data for every player in `brackets` |

### `TourneyEntry`

One row of the standings.

| Field | Type | Description |
| --- | --- | --- |
| `rank` | `number` | Current place in the standings |
| `prevRank` | `number` | Place before the latest round, for showing who moved up or down |
| `uuid` | `string` | Player UUID. Look it up in `players` to get the nickname |
| `completions` | `(TourneyCompletion \| number \| null)[]` | The player's result in each round, explained below |
| `point` | `number` | Total points: the `score` from every round plus `bonus` |
| `bonus` | `number \| undefined` | Extra points on top of round scores. Usually `0` |
| `eliminated` | `boolean` | Whether the player is out of the tourney |

`completions` has one slot per round, so `completions[0]` is round 1. A slot
holds a `TourneyCompletion` if the player finished that round, or `null` if
they didn't.

### `TourneyCompletion`

| Field | Type | Description |
| --- | --- | --- |
| `place` | `number` | Where the player finished in that round |
| `score` | `number` | Points earned for that finish |

### `TourneyPlayer`

| Field | Type | Description |
| --- | --- | --- |
| `uuid` | `string` | Player UUID |
| `nickname` | `string` | Current Minecraft name |
| `eloRate` | `number \| null` | Current Elo, or `null` if the player is unranked |
| `eloRank` | `number \| null` | Current Elo leaderboard rank, or `null` if unranked |
| `country` | `string \| null` | Country code, or `null` if the player hasn't set one |
| `roleType` | `number` | The API's numeric account role. Its values aren't documented |

### Older format in `showdown_s4`

`showdown_s4` predates the current format. Its `completions` are plain place
numbers with no `null` slots, so they don't line up with rounds, and its
entries have no `bonus`. If you read older tourneys, check each slot's type
before using it:

```ts
for (const slot of entry.completions) {
  if (typeof slot === "number") {
    // showdown_s4: a place, not tied to a specific round
  } else if (slot) {
    console.log(slot.place, slot.score);
  }
}
```

### Example: print the standings

```ts
const tourney = await mcsrranked.tourneys.get("showdown_s11");
const names = new Map(tourney.players.map((p) => [p.uuid, p.nickname]));

for (const entry of tourney.brackets) {
  const out = entry.eliminated ? " (eliminated)" : "";
  console.log(`${entry.rank}. ${names.get(entry.uuid)}: ${entry.point}${out}`);
}
```
