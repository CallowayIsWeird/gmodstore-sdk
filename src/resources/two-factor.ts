import { BaseResource } from "./base.js";
import type { TwoFactorNonce } from "../types.js";

export class TwoFactorResource extends BaseResource {
  exchangeTotp(code: string): Promise<TwoFactorNonce> {
    return this.postOne<TwoFactorNonce>("/v3/2fa/nonces/totp/exchange", { code });
  }
}
