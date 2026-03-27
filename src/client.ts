import { HttpClient } from "./http.js";

import type { RateLimitInfo } from "./errors.js";
import { MeResource } from "./resources/me.js";
import { UsersResource } from "./resources/users.js";
import { TeamsResource } from "./resources/teams.js";
import { ProductsResource } from "./resources/products.js";
import { TicketsResource } from "./resources/tickets.js";
import { PermissionsResource } from "./resources/permissions.js";
import { TwoFactorResource } from "./resources/two-factor.js";

export interface GModStoreClientOptions {
  /** Personal Access Token for authentication */
  token: string;
  /** API base URL. Defaults to https://api.pivity.com */
  baseUrl?: string;
  /** Tenant to scope requests to */
  tenant?: "gmodstore.com" | "rust.pivity.com";
  /** Maximum number of retries for 429/503 errors. Defaults to 3 */
  maxRetries?: number;
  /** Custom fetch implementation for testing */
  fetch?: typeof globalThis.fetch;
}

export class GModStoreClient {
  private readonly http: HttpClient;

  readonly me: MeResource;
  readonly users: UsersResource;
  readonly teams: TeamsResource;
  readonly products: ProductsResource;
  readonly tickets: TicketsResource;
  readonly permissions: PermissionsResource;
  readonly twoFactor: TwoFactorResource;

  constructor(options: GModStoreClientOptions) {
    this.http = new HttpClient(options);
    this.me = new MeResource(this.http);
    this.users = new UsersResource(this.http);
    this.teams = new TeamsResource(this.http);
    this.products = new ProductsResource(this.http);
    this.tickets = new TicketsResource(this.http);
    this.permissions = new PermissionsResource(this.http);
    this.twoFactor = new TwoFactorResource(this.http);
  }

  /** Current rate limit state, updated after every request */
  get rateLimit(): RateLimitInfo | undefined {
    return this.http.rateLimit;
  }
}
