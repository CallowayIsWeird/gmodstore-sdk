# gmodstore-sdk

TypeScript SDK for the [GModStore (Pivity) API v3](https://docs.gmodstore.com). Zero dependencies, full type safety, auto-pagination.

## Install

```bash
npm install @callowayisweird/gmodstore-sdk
```

## Quick Start

```ts
import { GModStoreClient } from "@callowayisweird/gmodstore-sdk";

const client = new GModStoreClient({
  token: "your-personal-access-token",
  tenant: "gmodstore.com",
});

// Get the authenticated user
const me = await client.me.get();
console.log(me.user.name);

// Get a user by ID
const user = await client.users.get("uuid");
console.log(user.steamId);

// Find users by Steam ID
const page = await client.users.list({
  filter: { steamId: [76561198000000000] },
});
console.log(page.data);
```

## Pagination

List methods return a `Page<T>` that supports async iteration:

```ts
// Iterate through all pages automatically
for await (const purchase of client.products.purchases.list("product-id")) {
  console.log(purchase.userId);
}

// Or work with pages manually
const page = await client.users.list({ perPage: 10 });
console.log(page.data);
console.log(page.hasNextPage);

if (page.hasNextPage) {
  const next = await page.getNextPage();
}
```

## Error Handling

Errors are structured by HTTP status:

```ts
import { NotFoundError, RateLimitError, BadRequestError } from "@callowayisweird/gmodstore-sdk";

try {
  await client.users.get("nonexistent");
} catch (e) {
  if (e instanceof NotFoundError) {
    console.log("User not found");
  }
  if (e instanceof RateLimitError) {
    console.log(`Retry after ${e.retryAfter} seconds`);
  }
  if (e instanceof BadRequestError) {
    console.log(e.errors); // { field: ["error message"] }
  }
}
```

429 and 503 errors are automatically retried with exponential backoff (up to 3 retries).

## Rate Limits

Rate limit info is available after any request:

```ts
const user = await client.users.get("uuid");
console.log(client.rateLimit);
// { limit: 300, remaining: 299, reset: 1711548000 }
```

## Resources

| Resource | Methods |
|----------|---------|
| `client.me` | `get()` |
| `client.me.tokens` | `list()`, `create()`, `get()`, `update()`, `delete()` |
| `client.users` | `list()`, `batch()`, `get()`, `teams()`, `products()`, `purchases()`, `bans()` |
| `client.users.badges` | `list()`, `create()`, `delete()` |
| `client.teams` | `list()`, `batch()`, `create()`, `get()`, `update()`, `delete()`, `users()`, `products()` |
| `client.teams.webhooks` | `list()`, `create()`, `get()`, `update()`, `delete()`, `test()`, `getSecret()`, `updateSecret()`, `attempts()`, `resend()` |
| `client.teams.webhookMessages` | `list()`, `get()`, `attempts()` |
| `client.products` | `list()`, `batch()`, `get()`, `tickets()` |
| `client.products.coupons` | `list()`, `create()`, `get()`, `update()`, `delete()` |
| `client.products.purchases` | `list()`, `create()`, `get()`, `update()` |
| `client.products.reviews` | `list()`, `get()` |
| `client.products.versions` | `list()`, `create()`, `get()`, `update()`, `delete()`, `download()` |
| `client.products.media` | `list()`, `create()`, `get()`, `update()`, `delete()`, `uploadBackground()`, `uploadPageHeader()`, `uploadBigHeader()`, `uploadListingHeader()` |
| `client.tickets` | `batch()`, `get()`, `update()`, `uploadLog()` |
| `client.tickets.messages` | `list()`, `create()`, `get()`, `update()`, `delete()`, `restore()` |
| `client.tickets.messages.revisions` | `list()`, `get()` |
| `client.tickets.attachments` | `list()`, `create()`, `get()`, `delete()` |
| `client.tickets.tags` | `list()`, `create()`, `delete()` |
| `client.permissions` | `list()`, `batch()`, `create()`, `get()`, `update()`, `delete()` |
| `client.twoFactor` | `exchangeTotp()` |

## Configuration

```ts
const client = new GModStoreClient({
  // Required
  token: "your-personal-access-token",

  // Optional
  tenant: "gmodstore.com",        // Scope to a specific marketplace
  baseUrl: "https://api.pivity.com", // Custom base URL
  maxRetries: 3,                   // Retry attempts for 429/503
  fetch: customFetch,              // Custom fetch implementation
});
```

## Tenant Scoping

By default, requests are not scoped to a marketplace. Pass `tenant` to filter:

```ts
// Only GModStore resources
const client = new GModStoreClient({ token: "...", tenant: "gmodstore.com" });

// Only Rust resources
const client = new GModStoreClient({ token: "...", tenant: "rust.pivity.com" });
```

## File Uploads

Endpoints that accept files use `FormData`:

```ts
// Upload a product version
const form = new FormData();
form.append("name", "v1.0.0");
form.append("changelog", "Initial release");
form.append("releaseType", "stable");
form.append("file", fileBlob);

const version = await client.products.versions.create("product-id", form);
```

## License

MIT
