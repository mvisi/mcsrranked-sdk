import { type Tourney, tourneySchema } from "../schemas/tourney.js";
import type { RouteRequester } from "../transport.js";
import type { ResponseValidator } from "../validation.js";

/**
 * Known ID patterns. `qualifiers_sN` is the Last Chance Qualifier held after
 * season N, `showdown_sN` is the Midseason Showdown of season N, and `wc_YYYY`
 * is a World Championship qualifier. Any other string is still accepted.
 */
export type TourneyId =
  | `qualifiers_s${number}`
  | `showdown_s${number}`
  | `wc_${number}`
  | (string & {});

export class TourneysResource {
  readonly #request: RouteRequester;
  readonly #validator: ResponseValidator;

  constructor(request: RouteRequester, validator: ResponseValidator) {
    this.#request = request;
    this.#validator = validator;
  }

  async get(id: TourneyId): Promise<Tourney> {
    const { data, url } = await this.#request(
      `tourneys/${encodeURIComponent(id)}`,
    );

    return this.#validator.validate(tourneySchema, data, {
      route: "tourneys.get",
      url: url.toString(),
    });
  }
}
