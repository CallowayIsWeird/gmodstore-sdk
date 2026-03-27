import {
  APIError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
  parseRateLimitHeaders,
} from "./errors.js";
import type { RateLimitInfo } from "./errors.js";
import type { ApiResponse } from "./types.js";

export interface HttpClientOptions {
  token: string;
  baseUrl?: string;
  tenant?: "gmodstore.com" | "rust.pivity.com";
  maxRetries?: number;
  fetch?: typeof globalThis.fetch;
}

export interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
  formData?: FormData;
  signal?: AbortSignal;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly tenant?: string;
  private readonly maxRetries: number;
  private readonly fetchFn: typeof globalThis.fetch;

  rateLimit: RateLimitInfo | undefined;

  constructor(options: HttpClientOptions) {
    this.baseUrl = (options.baseUrl ?? "https://api.pivity.com").replace(/\/$/, "");
    this.token = options.token;
    this.tenant = options.tenant;
    this.maxRetries = options.maxRetries ?? 3;
    this.fetchFn = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  async request<T>(options: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(options.path, options.query);
    const headers = this.buildHeaders(options);
    const init: RequestInit = {
      method: options.method,
      headers,
      body: options.formData ?? (options.body ? JSON.stringify(options.body) : undefined),
      signal: options.signal,
    };

    let lastError: APIError | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        await sleep(this.calculateBackoff(attempt, lastError));
      }

      const response = await this.fetchFn(url.toString(), init);
      this.rateLimit = parseRateLimitHeaders(response.headers);

      if (response.ok) {
        if (response.status === 204) {
          return { data: undefined as T, rateLimit: this.rateLimit, status: response.status, headers: response.headers };
        }
        const json = await response.json();
        return { data: json, rateLimit: this.rateLimit, status: response.status, headers: response.headers };
      }

      const error = await this.parseError(response);

      if ((response.status === 429 || response.status === 503) && attempt < this.maxRetries) {
        lastError = error;
        continue;
      }

      throw error;
    }

    throw lastError!;
  }

  private buildUrl(path: string, query?: Record<string, unknown>): URL {
    const url = new URL(path, this.baseUrl);
    if (!query) return url;

    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;

      if (key === "filter" && typeof value === "object") {
        for (const [field, filterValue] of Object.entries(value as Record<string, unknown>)) {
          if (filterValue === undefined || filterValue === null) continue;
          if (Array.isArray(filterValue)) {
            url.searchParams.set(`filter[${field}]`, filterValue.join(","));
          } else {
            url.searchParams.set(`filter[${field}]`, String(filterValue));
          }
        }
      } else if (key === "ids" && Array.isArray(value)) {
        for (const id of value) {
          url.searchParams.append("ids[]", String(id));
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
    return url;
  }

  private buildHeaders(options: RequestOptions): Record<string, string> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
    };
    if (this.tenant) {
      headers["X-Tenant"] = this.tenant;
    }
    if (options.body && !options.formData) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  }

  private calculateBackoff(attempt: number, lastError?: APIError): number {
    if (lastError instanceof RateLimitError && lastError.retryAfter > 0) {
      return lastError.retryAfter * 1000;
    }
    const base = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
    return base + Math.random() * 500;
  }

  private async parseError(response: Response): Promise<APIError> {
    let body: Record<string, unknown>;
    try {
      body = await response.json() as Record<string, unknown>;
    } catch {
      body = { message: response.statusText };
    }

    const message = (body.message as string) ?? "Unknown error";
    const headers = response.headers;

    switch (response.status) {
      case 400:
        return new BadRequestError(message, (body.errors as Record<string, string[]>) ?? {}, headers);
      case 401:
        return new UnauthorizedError(message, headers);
      case 403:
        return new ForbiddenError(message, headers);
      case 404:
        return new NotFoundError(message, headers);
      case 429: {
        const resetHeader = headers.get("x-ratelimit-reset");
        const retryAfter = resetHeader
          ? Math.max(0, parseInt(resetHeader, 10) - Math.floor(Date.now() / 1000))
          : 60;
        return new RateLimitError(message, headers, retryAfter);
      }
      case 503:
        return new ServiceUnavailableError(message, headers);
      default:
        if (response.status >= 500) {
          return new InternalServerError(response.status, message, headers);
        }
        return new APIError(response.status, message, headers);
    }
  }
}
