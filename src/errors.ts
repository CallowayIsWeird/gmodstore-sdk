export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export function parseRateLimitHeaders(headers: Headers): RateLimitInfo | undefined {
  const limit = headers.get("x-ratelimit-limit");
  const remaining = headers.get("x-ratelimit-remaining");
  if (limit === null || remaining === null) return undefined;
  return {
    limit: parseInt(limit, 10),
    remaining: parseInt(remaining, 10),
    reset: parseInt(headers.get("x-ratelimit-reset") ?? "0", 10),
  };
}

export class APIError extends Error {
  readonly status: number;
  readonly headers: Headers;
  readonly rateLimit: RateLimitInfo | undefined;

  constructor(status: number, message: string, headers: Headers) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.headers = headers;
    this.rateLimit = parseRateLimitHeaders(headers);
  }
}

export class BadRequestError extends APIError {
  readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>, headers: Headers) {
    super(400, message, headers);
    this.name = "BadRequestError";
    this.errors = errors;
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string, headers: Headers) {
    super(401, message, headers);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string, headers: Headers) {
    super(403, message, headers);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends APIError {
  constructor(message: string, headers: Headers) {
    super(404, message, headers);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends APIError {
  readonly retryAfter: number;

  constructor(message: string, headers: Headers, retryAfter: number) {
    super(429, message, headers);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class InternalServerError extends APIError {
  constructor(status: number, message: string, headers: Headers) {
    super(status, message, headers);
    this.name = "InternalServerError";
  }
}

export class ServiceUnavailableError extends APIError {
  constructor(message: string, headers: Headers) {
    super(503, message, headers);
    this.name = "ServiceUnavailableError";
  }
}
