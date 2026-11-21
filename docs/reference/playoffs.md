# Playoffs

Use `playoffs` to get the end-of-season playoff bracket. This route isn't in
the official API docs. The SDK's schema comes from live responses for seasons
1 through 11, so it may change without notice.

## `playoffs.current()`

Gets the latest season's playoffs.

```ts
playoffs.current(): Promise<PlayoffsPage>
```

```ts
const { data, prev } = await mcsrranked.playoffs.current();
console.log(data.season, data.results);
```

## `playoffs.get()`

Gets the playoffs for a season.

```ts
playoffs.get(season: number): Promise<PlayoffsPage>
```

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `season`  | `number` | Season number, starting at 1 |

```ts
const { data } = await mcsrranked.playoffs.get(5);
```

A season with no playoffs yet, including the current one before playoffs
start, fails with an HTTP 400 `RankedError`.

## Response shape

Both methods return a `PlayoffsPage`: one season's bracket, plus the
neighboring season numbers so you can step through past playoffs.

Inside the bracket, matches and results refer to players by number, not by
UUID. A `player` value is the player's position in the `players` array, so
`data.players[match.participants[0].player]` is that participant. The
[example](#example-print-the-results) shows this in full.

### `PlayoffsPage`

| Field | Type | Description |
| --- | --- | --- |
| `data` | `Playoffs` | The bracket for the requested season |
| `prev` | `number \| null` | The previous season with playoffs, or `null` |
| `next` | `number \| null` | The next season with playoffs, or `null` |

### `Playoffs`

| Field | Type | Description |
| --- | --- | --- |
| `season` | `number` | Season number |
| `type` | `string` | Bracket format. So far `"alpha"` or `"beta"`. Beta brackets (seasons 5 and 6) have extra `Round 1` and `Round 2` matches |
| `players` | `PlayoffPlayer[]` | The seeded players, ordered by seed |
| `matches` | `PlayoffMatch[]` | Every match in the bracket, listed from the grand final backwards |
| `results` | `{ place, player, prize }[]` | Final placements and prizes, described in [Results](#results) |

### `PlayoffPlayer`

| Field | Type | Description |
| --- | --- | --- |
| `uuid` | `string` | Player UUID |
| `nickname` | `string` | Current Minecraft name |
| `seedNumber` | `number` | Seed, starting at 0 for the top seed. Matches the player's position in `players` |
| `seasonEloRate` | `number \| null` | Elo for that season |
| `seasonEloRank` | `number \| null` | Elo leaderboard rank for that season |
| `personalBest` | `number \| null` | Fastest completion that season, in milliseconds |

### `PlayoffMatch`

| Field | Type | Description |
| --- | --- | --- |
| `id` | `number` | The match's ID within this bracket. It isn't a ranked match ID |
| `name` | `string` | Display name, such as `"Grand Finals"`, `"3rd Place"`, or `"Round of 16"` |
| `nextMatchId` | `number \| null` | The bracket match the winner moves on to. `null` for the finals, and for older seasons that didn't record it |
| `maxRoundScore` | `number` | Games a player must win to take the match |
| `startTime` | `number \| null` | Scheduled start, as a Unix timestamp in seconds |
| `state` | `string \| null` | `"SCHEDULED"`, `"ACTIVE"`, `"DONE"`, or `null` |
| `participants` | `{ player, roundScore }[]` | The players in the match, explained below |
| `vod` | `string \| null` | Link to a recording of the match, if there is one |

Each participant has a `player`, which is a position in `players`, and a
`roundScore`, the number of games they've won in this match. A slot that
hasn't been decided yet is left out, so a match can have fewer than two
participants.

### Results

Each entry in `results` has:

| Field | Type | Description |
| --- | --- | --- |
| `place` | `number` | Final placement, starting at 1 |
| `player` | `number \| null` | Position in `players`, or `null` if not decided yet |
| `prize` | `number` | Prize money in USD |

### Example: print the results

```ts
const { data } = await mcsrranked.playoffs.get(11);

for (const result of data.results) {
  const name =
    result.player === null ? "TBD" : data.players[result.player]?.nickname;
  console.log(`${result.place}. ${name} ($${result.prize})`);
}
```
