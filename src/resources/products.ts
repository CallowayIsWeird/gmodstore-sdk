import { BaseResource } from "./base.js";
import type { HttpClient } from "../http.js";
import type {
  Product, ProductCoupon, ProductPurchase, ProductReview,
  ProductVersion, ProductMedium, Ticket, MediaResponse,
  PaginationOptions, ProductFilter, ProductCouponFilter,
  ProductPurchaseFilter, ProductReviewFilter, ProductVersionFilter,
  TicketFilter,
} from "../types.js";
import type { Page } from "../pagination.js";

export class ProductCouponsResource extends BaseResource {
  list(productId: string, options?: PaginationOptions & { filter?: ProductCouponFilter }): Promise<Page<ProductCoupon>> {
    return this.fetchList<ProductCoupon>(`/v3/products/${productId}/coupons`, options);
  }

  create(productId: string, body: { code: string; percent: number; maxUses: number; expiresAt: string; boundUserId?: string | null }): Promise<ProductCoupon> {
    return this.postOne<ProductCoupon>(`/v3/products/${productId}/coupons`, body);
  }

  get(productId: string, couponId: string): Promise<ProductCoupon> {
    return this.fetchOne<ProductCoupon>(`/v3/products/${productId}/coupons/${couponId}`);
  }

  update(productId: string, couponId: string, body: { code?: string; percent?: number; maxUses?: number; expiresAt?: string; boundUserId?: string | null }): Promise<ProductCoupon> {
    return this.putOne<ProductCoupon>(`/v3/products/${productId}/coupons/${couponId}`, body);
  }

  delete(productId: string, couponId: string): Promise<void> {
    return this.deleteOne(`/v3/products/${productId}/coupons/${couponId}`);
  }
}

export class ProductPurchasesResource extends BaseResource {
  list(productId: string, options?: PaginationOptions & { filter?: ProductPurchaseFilter }): Promise<Page<ProductPurchase>> {
    return this.fetchList<ProductPurchase>(`/v3/products/${productId}/purchases`, options);
  }

  create(productId: string, body: { userId: string }): Promise<ProductPurchase> {
    return this.postOne<ProductPurchase>(`/v3/products/${productId}/purchases`, body);
  }

  get(productId: string, purchaseId: string): Promise<ProductPurchase> {
    return this.fetchOne<ProductPurchase>(`/v3/products/${productId}/purchases/${purchaseId}`);
  }

  update(productId: string, purchaseId: string, body: { revoked?: boolean }): Promise<ProductPurchase> {
    return this.putOne<ProductPurchase>(`/v3/products/${productId}/purchases/${purchaseId}`, body);
  }
}

export class ProductReviewsResource extends BaseResource {
  list(productId: string, options?: PaginationOptions & { filter?: ProductReviewFilter }): Promise<Page<ProductReview>> {
    return this.fetchList<ProductReview>(`/v3/products/${productId}/reviews`, options);
  }

  get(productId: string, reviewId: string): Promise<ProductReview> {
    return this.fetchOne<ProductReview>(`/v3/products/${productId}/reviews/${reviewId}`);
  }
}

export class ProductVersionsResource extends BaseResource {
  list(productId: string, options?: PaginationOptions & { filter?: ProductVersionFilter }): Promise<Page<ProductVersion>> {
    return this.fetchList<ProductVersion>(`/v3/products/${productId}/versions`, options);
  }

  create(productId: string, formData: FormData): Promise<ProductVersion> {
    return this.uploadFormData<ProductVersion>(`/v3/products/${productId}/versions`, formData);
  }

  get(productId: string, versionId: string): Promise<ProductVersion> {
    return this.fetchOne<ProductVersion>(`/v3/products/${productId}/versions/${versionId}`);
  }

  update(productId: string, versionId: string, body: { name?: string; changelog?: string; releaseType?: string }): Promise<ProductVersion> {
    return this.putOne<ProductVersion>(`/v3/products/${productId}/versions/${versionId}`, body);
  }

  delete(productId: string, versionId: string): Promise<void> {
    return this.deleteOne(`/v3/products/${productId}/versions/${versionId}`);
  }

  async download(productId: string, versionId: string): Promise<MediaResponse> {
    return this.postOne<MediaResponse>(`/v3/products/${productId}/versions/${versionId}/download`);
  }
}

export class ProductMediaResource extends BaseResource {
  list(productId: string, options?: PaginationOptions): Promise<Page<ProductMedium>> {
    return this.fetchList<ProductMedium>(`/v3/products/${productId}/media`, options);
  }

  create(productId: string, formData: FormData): Promise<ProductMedium> {
    return this.uploadFormData<ProductMedium>(`/v3/products/${productId}/media`, formData);
  }

  get(productId: string, mediumId: string): Promise<ProductMedium> {
    return this.fetchOne<ProductMedium>(`/v3/products/${productId}/media/${mediumId}`);
  }

  update(productId: string, mediumId: string, body: { title?: string; displayOrder?: number }): Promise<ProductMedium> {
    return this.putOne<ProductMedium>(`/v3/products/${productId}/media/${mediumId}`, body);
  }

  delete(productId: string, mediumId: string): Promise<void> {
    return this.deleteOne(`/v3/products/${productId}/media/${mediumId}`);
  }

  uploadBackground(productId: string, formData: FormData): Promise<ProductMedium> {
    return this.uploadFormData<ProductMedium>(`/v3/products/${productId}/media/background`, formData);
  }

  uploadPageHeader(productId: string, formData: FormData): Promise<ProductMedium> {
    return this.uploadFormData<ProductMedium>(`/v3/products/${productId}/media/page-header`, formData);
  }

  uploadBigHeader(productId: string, formData: FormData): Promise<ProductMedium> {
    return this.uploadFormData<ProductMedium>(`/v3/products/${productId}/media/big-header`, formData);
  }

  uploadListingHeader(productId: string, formData: FormData): Promise<ProductMedium> {
    return this.uploadFormData<ProductMedium>(`/v3/products/${productId}/media/listing-header`, formData);
  }
}

export class ProductsResource extends BaseResource {
  readonly coupons: ProductCouponsResource;
  readonly purchases: ProductPurchasesResource;
  readonly reviews: ProductReviewsResource;
  readonly versions: ProductVersionsResource;
  readonly media: ProductMediaResource;

  constructor(http: HttpClient) {
    super(http);
    this.coupons = new ProductCouponsResource(http);
    this.purchases = new ProductPurchasesResource(http);
    this.reviews = new ProductReviewsResource(http);
    this.versions = new ProductVersionsResource(http);
    this.media = new ProductMediaResource(http);
  }

  batch(ids: string[]): Promise<Product[]> {
    return this.fetchBatch<Product>("/v3/products/batch", ids);
  }

  get(productId: string): Promise<Product> {
    return this.fetchOne<Product>(`/v3/products/${productId}`);
  }

  list(teamId: string, options?: PaginationOptions & { filter?: ProductFilter }): Promise<Page<Product>> {
    return this.fetchList<Product>(`/v3/teams/${teamId}/products`, options);
  }

  tickets(productId: string, options?: PaginationOptions & { filter?: TicketFilter }): Promise<Page<Ticket>> {
    return this.fetchList<Ticket>(`/v3/products/${productId}/tickets`, options);
  }
}
