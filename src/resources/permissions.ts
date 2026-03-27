import { BaseResource } from "./base.js";
import type { PermissionGroup, PaginationOptions } from "../types.js";
import type { Page } from "../pagination.js";

export class PermissionsResource extends BaseResource {
  list(options?: PaginationOptions): Promise<Page<PermissionGroup>> {
    return this.fetchList<PermissionGroup>("/v3/permission-groups", options);
  }

  batch(ids: string[]): Promise<PermissionGroup[]> {
    return this.fetchBatch<PermissionGroup>("/v3/permission-groups/batch", ids);
  }

  create(body: { title: string; commissionRate?: number; displayOrder?: number; hoisted?: boolean; permissions?: string }): Promise<PermissionGroup> {
    return this.postOne<PermissionGroup>("/v3/permission-groups", body);
  }

  get(groupId: string): Promise<PermissionGroup> {
    return this.fetchOne<PermissionGroup>(`/v3/permission-groups/${groupId}`);
  }

  update(groupId: string, body: { title?: string; commissionRate?: number; displayOrder?: number; hoisted?: boolean; permissions?: string }): Promise<PermissionGroup> {
    return this.putOne<PermissionGroup>(`/v3/permission-groups/${groupId}`, body);
  }

  delete(groupId: string): Promise<void> {
    return this.deleteOne(`/v3/permission-groups/${groupId}`);
  }
}
