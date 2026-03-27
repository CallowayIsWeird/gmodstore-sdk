import { BaseResource } from "./base.js";
import type { HttpClient } from "../http.js";
import type { Me, PersonalAccessToken, PaginationOptions } from "../types.js";
import type { Page } from "../pagination.js";

export class PersonalAccessTokensResource extends BaseResource {
  list(options?: PaginationOptions): Promise<Page<PersonalAccessToken>> {
    return this.fetchList<PersonalAccessToken>("/v3/me/personal-access-tokens", options);
  }

  create(body: { name: string; expiresAt?: string | null; abilities: string[] }): Promise<PersonalAccessToken> {
    return this.postOne<PersonalAccessToken>("/v3/me/personal-access-tokens", body);
  }

  get(tokenId: string): Promise<PersonalAccessToken> {
    return this.fetchOne<PersonalAccessToken>(`/v3/me/personal-access-tokens/${tokenId}`);
  }

  update(tokenId: string, body: { name?: string; abilities?: string[] }): Promise<PersonalAccessToken> {
    return this.putOne<PersonalAccessToken>(`/v3/me/personal-access-tokens/${tokenId}`, body);
  }

  delete(tokenId: string): Promise<void> {
    return this.deleteOne(`/v3/me/personal-access-tokens/${tokenId}`);
  }
}

export class MeResource extends BaseResource {
  readonly tokens: PersonalAccessTokensResource;

  constructor(http: HttpClient) {
    super(http);
    this.tokens = new PersonalAccessTokensResource(http);
  }

  get(): Promise<Me> {
    return this.fetchOne<Me>("/v3/me");
  }
}
