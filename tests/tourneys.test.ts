import { describe, expect, it, vi } from "vitest";

import { RankedClient } from "../src/index.js";
import { legacyShowdownFixture, tourneyFixture } from "./fixtures/tourneys.js";

function clientReturning(data: unknown, onUrl?: (url: string) => void) {
  return new RankedClient({
    baseUrl: "https://ranked.example/api/",
    validation: "error",
    fetch: async (input) => {
      onUrl?.(String(input));
      return new Response(JSON.stringify({ status: "success", data }), {
        status: 200,
      });
    },
  });
}

describe("tourneys.get", () => {
  it("requests a tourney by ID", async () => {
    let requestedUrl: string | undefined;
    const client = clientReturning(tourneyFixture, (url) => {
      requestedUrl = url;
    });

    const tourney = await client.tourneys.get("showdown_s11");

    expect(requestedUrl).toBe(
      "https://ranked.example/api/tourneys/showdown_s11",
    );
    expect(tourney).toEqual(tourneyFixture);
  });

  it("accepts the older showdown_s4 shape", async () => {
    const client = clientReturning(legacyShowdownFixture);

    const tourney = await client.tourneys.get("showdown_s4");

    expect(tourney.brackets[0]?.completions).toEqual([2, 20]);
    expect(tourney.brackets[0]?.bonus).toBeUndefined();
  });
});

const invalidResponseCases = [
  ["tourneys.get", (client: RankedClient) => client.tourneys.get("wc_2026")],
] satisfies ReadonlyArray<
  readonly [string, (client: RankedClient) => Promise<unknown>]
>;

describe("tourneys response schemas", () => {
  it.each(invalidResponseCases)("validates %s", async (route, request) => {
    const onIssue = vi.fn();
    const client = new RankedClient({
      validation: { onIssue },
      fetch: async () =>
        new Response(JSON.stringify({ status: "success", data: {} }), {
          status: 200,
        }),
    });

    await request(client);

    expect(onIssue).toHaveBeenCalledWith(expect.objectContaining({ route }));
  });
});
