# Authentication and private live data

Most MCSR Ranked endpoints are public. The per-player live endpoint requires a
private API key. The requested player must host or co-host the private room.

## Get a private key

Open an MCSR Ranked instance, then go to **Profile**, **Settings**, and
**Generate & Copy API Private Key**.

Treat the key like a password. Do not commit it to your repository or include
it in browser code.

## Create an authenticated client

Pass the key to `RankedClient`.

```ts
import { RankedClient } from "mcsrranked-sdk";

const ranked = new RankedClient({
  privateKey: process.env.MCSR_RANKED_PRIVATE_KEY,
});

const live = await ranked.users.live("NotAva1able");
```

The client sends the `Private-Key` header only for methods that request it.
Public resource methods do not receive the key.

!!! danger "Server only"

    Environment variables used by client-side frameworks can still end up in
    the browser. Keep the authenticated client in a server-only module,
    Server Component, route handler, or backend service.

## Handle a missing key

`users.live()` fails before sending a request when no key is configured:

```ts
import { RankedError } from "mcsrranked-sdk";

try {
  await ranked.users.live("NotAva1able");
} catch (error) {
  if (error instanceof RankedError && error.code === "MISSING_PRIVATE_KEY") {
    console.error("Configure MCSR_RANKED_PRIVATE_KEY on the server.");
  }
}
```

Authentication is required only on the `users.live` endpoint.

## Configure an expanded-rate-limit key

Pass an expanded-rate-limit API key to `RankedClient` when you have one:

```ts
const ranked = new RankedClient({
  apiKey: process.env.MCSR_RANKED_API_KEY,
});
```

The client sends it in the `api-key` header to MCSR Ranked API endpoints. It
does not send the key to the separately hosted status endpoint. Low-level
`request()` and `fetch()` calls can omit it for a specific request by passing
`excludeApiKey: true`.
