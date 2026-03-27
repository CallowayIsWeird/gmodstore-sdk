// Client
export { GModStoreClient } from "./client.js";
export type { GModStoreClientOptions } from "./client.js";

// Errors
export {
  APIError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
} from "./errors.js";
export type { RateLimitInfo } from "./errors.js";

// Pagination
export { Page } from "./pagination.js";
export type { PageInfo } from "./pagination.js";

// Types
export type {
  // Schema types
  User,
  Product,
  Team,
  Ticket,
  TicketMessage,
  TicketMessageRevision,
  TicketAttachment,
  TicketTag,
  TicketTicketTag,
  PersonalAccessToken,
  PersonalAccessTokenScope,
  PermissionGroup,
  ProductCoupon,
  ProductPurchase,
  ProductReview,
  ProductVersion,
  ProductMedium,
  TeamUser,
  TeamWebhookEndpoint,
  TeamWebhookMessage,
  TeamWebhookAttempt,
  TeamWebhookMessageAttempt,
  WebhookEndpointSecret,
  UserBadge,
  UserBan,
  Me,
  Money,
  OrderItem,
  TwoFactorNonce,
  Tenant,
  MediaResponse,
  TicketLogRequest,

  // Filter types
  UserFilter,
  ProductFilter,
  ProductCouponFilter,
  ProductPurchaseFilter,
  ProductReviewFilter,
  ProductVersionFilter,
  UserBanFilter,
  TicketFilter,

  // Helpers
  PaginatedResponse,
  SingleResponse,
  PaginationOptions,
  ApiResponse,
} from "./types.js";
