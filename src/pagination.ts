import type { HttpClient } from "./http.js";
import type { PaginatedResponse } from "./types.js";
import type { RateLimitInfo } from "./errors.js";

export interface PageInfo {
  cursors: { prev: string | null; next: string | null };
  connections: string[];
  perPage: number;
}

export class Page<T> implements AsyncIterable<T> {
  readonly data: T[];
  readonly pageInfo: PageInfo;
  readonly rateLimit: RateLimitInfo | undefined;

  private readonly httpClient: HttpClient;
  private readonly path: string;
  private readonly query: Record<string, unknown>;

  constructor(
    response: PaginatedResponse<T>,
    rateLimit: RateLimitInfo | undefined,
    httpClient: HttpClient,
    path: string,
    query: Record<string, unknown>,
  ) {
    this.data = response.data;
    this.pageInfo = {
      cursors: response.cursors,
      connections: response.connections,
      perPage: response.meta.perPage,
    };
    this.rateLimit = rateLimit;
    this.httpClient = httpClient;
    this.path = path;
    this.query = query;
  }

  get hasNextPage(): boolean {
    return this.pageInfo.cursors.next !== null;
  }

  get hasPreviousPage(): boolean {
    return this.pageInfo.cursors.prev !== null;
  }

  async getNextPage(): Promise<Page<T>> {
    if (!this.hasNextPage) throw new Error("No next page available");
    return this.fetchPage(this.pageInfo.cursors.next!);
  }

  async getPreviousPage(): Promise<Page<T>> {
    if (!this.hasPreviousPage) throw new Error("No previous page available");
    return this.fetchPage(this.pageInfo.cursors.prev!);
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let page: Page<T> = this;
    while (true) {
      for (const item of page.data) {
        yield item;
      }
      if (!page.hasNextPage) break;
      page = await page.getNextPage();
    }
  }

  private async fetchPage(cursor: string): Promise<Page<T>> {
    const query = { ...this.query, cursor };
    const response = await this.httpClient.request<PaginatedResponse<T>>({
      method: "GET",
      path: this.path,
      query,
    });
    return new Page<T>(response.data, response.rateLimit, this.httpClient, this.path, query);
  }
}
