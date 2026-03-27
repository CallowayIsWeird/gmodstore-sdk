import type { HttpClient } from "../http.js";
import type { PaginatedResponse, PaginationOptions } from "../types.js";
import { Page } from "../pagination.js";

export abstract class BaseResource {
  protected readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  protected async fetchOne<T>(path: string): Promise<T> {
    const res = await this.http.request<{ data: T }>({ method: "GET", path });
    return res.data.data;
  }

  protected async fetchList<T>(path: string, options?: PaginationOptions & { filter?: unknown }): Promise<Page<T>> {
    const query: Record<string, unknown> = {};
    if (options?.perPage) query.perPage = options.perPage;
    if (options?.cursor) query.cursor = options.cursor;
    if (options?.filter) query.filter = options.filter;

    const res = await this.http.request<PaginatedResponse<T>>({ method: "GET", path, query });
    return new Page<T>(res.data, res.rateLimit, this.http, path, query);
  }

  protected async fetchBatch<T>(path: string, ids: string[]): Promise<T[]> {
    const res = await this.http.request<{ data: T[] }>({ method: "GET", path, query: { ids } });
    return res.data.data;
  }

  protected async postOne<T>(path: string, body?: unknown): Promise<T> {
    const res = await this.http.request<{ data: T }>({ method: "POST", path, body });
    return res.data.data;
  }

  protected async putOne<T>(path: string, body: unknown): Promise<T> {
    const res = await this.http.request<{ data: T }>({ method: "PUT", path, body });
    return res.data.data;
  }

  protected async patchOne<T>(path: string, body: unknown): Promise<T> {
    const res = await this.http.request<{ data: T }>({ method: "PATCH", path, body });
    return res.data.data;
  }

  protected async deleteOne(path: string): Promise<void> {
    await this.http.request<void>({ method: "DELETE", path });
  }

  protected async uploadFormData<T>(path: string, formData: FormData): Promise<T> {
    const res = await this.http.request<{ data: T }>({ method: "POST", path, formData });
    return res.data.data;
  }
}
