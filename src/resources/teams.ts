import { BaseResource } from "./base.js";
import type { HttpClient } from "../http.js";
import type {
  Team, TeamUser, TeamWebhookEndpoint, TeamWebhookMessage,
  TeamWebhookAttempt, TeamWebhookMessageAttempt, WebhookEndpointSecret,
  Product, PaginationOptions,
} from "../types.js";
import type { Page } from "../pagination.js";

export class TeamWebhooksResource extends BaseResource {
  list(teamId: string, options?: PaginationOptions): Promise<Page<TeamWebhookEndpoint>> {
    return this.fetchList<TeamWebhookEndpoint>(`/v3/teams/${teamId}/webhook-endpoints`, options);
  }

  create(teamId: string, body: { url: string; description?: string; filterTypes?: string[]; channels?: string[] }): Promise<TeamWebhookEndpoint> {
    return this.postOne<TeamWebhookEndpoint>(`/v3/teams/${teamId}/webhook-endpoints`, body);
  }

  get(teamId: string, webhookId: string): Promise<TeamWebhookEndpoint> {
    return this.fetchOne<TeamWebhookEndpoint>(`/v3/teams/${teamId}/webhook-endpoints/${webhookId}`);
  }

  update(teamId: string, webhookId: string, body: { url?: string; description?: string; disabled?: boolean; filterTypes?: string[]; channels?: string[] }): Promise<TeamWebhookEndpoint> {
    return this.putOne<TeamWebhookEndpoint>(`/v3/teams/${teamId}/webhook-endpoints/${webhookId}`, body);
  }

  delete(teamId: string, webhookId: string): Promise<void> {
    return this.deleteOne(`/v3/teams/${teamId}/webhook-endpoints/${webhookId}`);
  }

  test(teamId: string): Promise<void> {
    return this.postOne(`/v3/teams/${teamId}/webhook-endpoints/test`);
  }

  getSecret(teamId: string, webhookId: string): Promise<WebhookEndpointSecret> {
    return this.fetchOne<WebhookEndpointSecret>(`/v3/teams/${teamId}/webhook-endpoints/${webhookId}/secret`);
  }

  updateSecret(teamId: string, webhookId: string, body: { key: string }): Promise<WebhookEndpointSecret> {
    return this.putOne<WebhookEndpointSecret>(`/v3/teams/${teamId}/webhook-endpoints/${webhookId}/secret`, body);
  }

  attempts(teamId: string, webhookId: string, options?: PaginationOptions): Promise<Page<TeamWebhookAttempt>> {
    return this.fetchList<TeamWebhookAttempt>(`/v3/teams/${teamId}/webhook-endpoints/${webhookId}/attempts`, options);
  }

  resend(teamId: string, webhookId: string, messageId: string): Promise<void> {
    return this.postOne(`/v3/teams/${teamId}/webhook-endpoints/${webhookId}/attempts/${messageId}/resend`);
  }
}

export class TeamWebhookMessagesResource extends BaseResource {
  list(teamId: string, options?: PaginationOptions): Promise<Page<TeamWebhookMessage>> {
    return this.fetchList<TeamWebhookMessage>(`/v3/teams/${teamId}/webhook-messages`, options);
  }

  get(teamId: string, messageId: string): Promise<TeamWebhookMessage> {
    return this.fetchOne<TeamWebhookMessage>(`/v3/teams/${teamId}/webhook-messages/${messageId}`);
  }

  attempts(teamId: string, messageId: string, options?: PaginationOptions): Promise<Page<TeamWebhookMessageAttempt>> {
    return this.fetchList<TeamWebhookMessageAttempt>(`/v3/teams/${teamId}/webhook-messages/${messageId}/attempts`, options);
  }
}

export class TeamsResource extends BaseResource {
  readonly webhooks: TeamWebhooksResource;
  readonly webhookMessages: TeamWebhookMessagesResource;

  constructor(http: HttpClient) {
    super(http);
    this.webhooks = new TeamWebhooksResource(http);
    this.webhookMessages = new TeamWebhookMessagesResource(http);
  }

  list(options?: PaginationOptions): Promise<Page<Team>> {
    return this.fetchList<Team>("/v3/teams", options);
  }

  batch(ids: string[]): Promise<Team[]> {
    return this.fetchBatch<Team>("/v3/teams/batch", ids);
  }

  create(body: { name: string; description?: string }): Promise<Team> {
    return this.postOne<Team>("/v3/teams", body);
  }

  get(teamId: string): Promise<Team> {
    return this.fetchOne<Team>(`/v3/teams/${teamId}`);
  }

  update(teamId: string, body: { name?: string; description?: string }): Promise<Team> {
    return this.putOne<Team>(`/v3/teams/${teamId}`, body);
  }

  delete(teamId: string): Promise<void> {
    return this.deleteOne(`/v3/teams/${teamId}`);
  }

  users(teamId: string, options?: PaginationOptions): Promise<Page<TeamUser>> {
    return this.fetchList<TeamUser>(`/v3/teams/${teamId}/users`, options);
  }

  products(teamId: string, options?: PaginationOptions): Promise<Page<Product>> {
    return this.fetchList<Product>(`/v3/teams/${teamId}/products`, options);
  }
}
