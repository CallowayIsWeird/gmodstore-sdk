import type { components } from "./generated/openapi.js";
import type { RateLimitInfo } from "./errors.js";

// Schema types
export type User = components["schemas"]["User"];
export type Product = components["schemas"]["Product"];
export type Team = components["schemas"]["Team"];
export type Ticket = components["schemas"]["Ticket"];
export type TicketMessage = components["schemas"]["TicketMessage"];
export type TicketMessageRevision = components["schemas"]["TicketMessageRevision"];
export type TicketAttachment = components["schemas"]["TicketAttachment"];
export type TicketTag = components["schemas"]["TicketTag"];
export type TicketTicketTag = components["schemas"]["TicketTicketTag"];
export type PersonalAccessToken = components["schemas"]["PersonalAccessToken"];
export type PersonalAccessTokenScope = components["schemas"]["PersonalAccessTokenScope"];
export type PermissionGroup = components["schemas"]["PermissionGroup"];
export type ProductCoupon = components["schemas"]["ProductCoupon"];
export type ProductPurchase = components["schemas"]["ProductPurchase"];
export type ProductReview = components["schemas"]["ProductReview"];
export type ProductVersion = components["schemas"]["ProductVersion"];
export type ProductMedium = components["schemas"]["ProductMedium"];
export type TeamUser = components["schemas"]["TeamUser"];
export type TeamWebhookEndpoint = components["schemas"]["TeamWebhookEndpoint"];
export type TeamWebhookMessage = components["schemas"]["TeamWebhookMessage"];
export type TeamWebhookAttempt = components["schemas"]["TeamWebhookAttempt"];
export type TeamWebhookMessageAttempt = components["schemas"]["TeamWebhookMessageAttempt"];
export type WebhookEndpointSecret = components["schemas"]["WebhookEndpointSecret"];
export type UserBadge = components["schemas"]["UserBadge"];
export type UserBan = components["schemas"]["UserBan"];
export type Me = components["schemas"]["Me"];
export type Money = components["schemas"]["Money"];
export type OrderItem = components["schemas"]["OrderItem"];
export type TwoFactorNonce = components["schemas"]["TwoFactorNonce"];
export type Tenant = components["schemas"]["Tenant"];
export type MediaResponse = components["schemas"]["MediaResponse"];
export type TicketLogRequest = components["schemas"]["TicketLogRequest"];

// Filter types
export type UserFilter = components["schemas"]["UserFilter"];
export type ProductFilter = components["schemas"]["ProductFilter"];
export type ProductCouponFilter = components["schemas"]["ProductCouponFilter"];
export type ProductPurchaseFilter = components["schemas"]["ProductPurchaseFilter"];
export type ProductReviewFilter = components["schemas"]["ProductReviewFilter"];
export type ProductVersionFilter = components["schemas"]["ProductVersionFilter"];
export type UserBanFilter = components["schemas"]["UserBanFilter"];
export type TicketFilter = components["schemas"]["TicketFilter"];

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  cursors: { prev: string | null; next: string | null };
  connections: string[];
  meta: { perPage: number };
}

export interface SingleResponse<T> {
  data: T;
}

export interface PaginationOptions {
  perPage?: number;
  cursor?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  rateLimit: RateLimitInfo | undefined;
  status: number;
  headers: Headers;
}
