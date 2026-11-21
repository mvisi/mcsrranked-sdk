import { describe, expect, it, vi } from "vitest";

import { RankedClient } from "../src/index.js";
import { playoffsPageFixture } from "./fixtures/playoffs.js";

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

describe("playoffs", () => {
  it("requests the latest playoffs", async () => {
    let requestedUrl: string | undefined;
    const client = clientReturning(playoffsPageFixture, (url) => {
      requestedUrl = url;
    });

    const page = await client.playoffs.current();

    expect(requestedUrl).toBe("https://ranked.example/api/playoffs");
    expect(page).toEqual(playoffsPageFixture);
  });

  it("requests playoffs by season", async () => {
    let requestedUrl: string | undefined;
    const client = clientReturning(playoffsPageFixture, (url) => {
      requestedUrl = url;
    });

    const page = await client.playoffs.get(11);

    expect(requestedUrl).toBe("https://ranked.example/api/playoffs/11");
    expect(page.prev).toBe(10);
    expect(page.data.matches[1]?.participants).toHaveLength(1);
  });
});

const invalidResponseCases = [
  ["playoffs.current", (client: RankedClient) => client.playoffs.current()],
  ["playoffs.get", (client: RankedClient) => client.playoffs.get(1)],
] satisfies ReadonlyArray<
  readonly [string, (client: RankedClient) => Promise<unknown>]
>;

describe("playoffs response schemas", () => {
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
