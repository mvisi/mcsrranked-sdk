import { type PlayoffsPage, playoffsPageSchema } from "../schemas/playoffs.js";
import type { RouteRequester } from "../transport.js";
import type { ResponseValidator } from "../validation.js";

export class PlayoffsResource {
  readonly #request: RouteRequester;
  readonly #validator: ResponseValidator;

  constructor(request: RouteRequester, validator: ResponseValidator) {
    this.#request = request;
    this.#validator = validator;
  }

  current(): Promise<PlayoffsPage> {
    return this.#get("playoffs", "playoffs.current");
  }

  get(season: number): Promise<PlayoffsPage> {
    return this.#get(`playoffs/${season}`, "playoffs.get");
  }

  async #get(path: string, route: string): Promise<PlayoffsPage> {
    const { data, url } = await this.#request(path);

    return this.#validator.validate(playoffsPageSchema, data, {
      route,
      url: url.toString(),
    });
  }
}
