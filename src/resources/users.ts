import { BaseResource } from "./base.js";
import type { HttpClient } from "../http.js";
import type {
  User, UserBadge, UserBan, ProductPurchase, Product, Team,
  PaginationOptions, UserFilter, UserBanFilter,
} from "../types.js";
import type { Page } from "../pagination.js";

export class UserBadgesResource extends BaseResource {
  list(userId: string, options?: PaginationOptions): Promise<Page<UserBadge>> {
    return this.fetchList<UserBadge>(`/v3/users/${userId}/badges`, options);
  }

  create(userId: string, body: { id: string }): Promise<UserBadge> {
    return this.postOne<UserBadge>(`/v3/users/${userId}/badges`, body);
  }

  delete(userId: string, badgeId: string): Promise<void> {
    return this.deleteOne(`/v3/users/${userId}/badges/${badgeId}`);
  }
}

export class UsersResource extends BaseResource {
  readonly badges: UserBadgesResource;

  constructor(http: HttpClient) {
    super(http);
    this.badges = new UserBadgesResource(http);
  }

  list(options?: PaginationOptions & { filter?: UserFilter }): Promise<Page<User>> {
    return this.fetchList<User>("/v3/users", options);
  }

  batch(ids: string[]): Promise<User[]> {
    return this.fetchBatch<User>("/v3/users/batch", ids);
  }

  get(userId: string): Promise<User> {
    return this.fetchOne<User>(`/v3/users/${userId}`);
  }

  teams(userId: string, options?: PaginationOptions): Promise<Page<Team>> {
    return this.fetchList<Team>(`/v3/users/${userId}/teams`, options);
  }

  products(userId: string, options?: PaginationOptions): Promise<Page<Product>> {
    return this.fetchList<Product>(`/v3/users/${userId}/products`, options);
  }

  purchases(userId: string, options?: PaginationOptions): Promise<Page<ProductPurchase>> {
    return this.fetchList<ProductPurchase>(`/v3/users/${userId}/purchases`, options);
  }

  bans(userId: string, options?: PaginationOptions & { filter?: UserBanFilter }): Promise<Page<UserBan>> {
    return this.fetchList<UserBan>(`/v3/users/${userId}/bans`, options);
  }
}
