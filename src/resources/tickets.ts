import { BaseResource } from "./base.js";
import type { HttpClient } from "../http.js";
import type {
  Ticket, TicketMessage, TicketMessageRevision, TicketAttachment,
  TicketTicketTag, PaginationOptions,
} from "../types.js";
import type { Page } from "../pagination.js";

export class TicketMessageRevisionsResource extends BaseResource {
  list(ticketId: string, messageId: string, options?: PaginationOptions): Promise<Page<TicketMessageRevision>> {
    return this.fetchList<TicketMessageRevision>(`/v3/tickets/${ticketId}/messages/${messageId}/revisions`, options);
  }

  get(ticketId: string, messageId: string, revisionId: string): Promise<TicketMessageRevision> {
    return this.fetchOne<TicketMessageRevision>(`/v3/tickets/${ticketId}/messages/${messageId}/revisions/${revisionId}`);
  }
}

export class TicketMessagesResource extends BaseResource {
  readonly revisions: TicketMessageRevisionsResource;

  constructor(http: HttpClient) {
    super(http);
    this.revisions = new TicketMessageRevisionsResource(http);
  }

  list(ticketId: string, options?: PaginationOptions): Promise<Page<TicketMessage>> {
    return this.fetchList<TicketMessage>(`/v3/tickets/${ticketId}/messages`, options);
  }

  create(ticketId: string, body: { body: string }): Promise<TicketMessage> {
    return this.postOne<TicketMessage>(`/v3/tickets/${ticketId}/messages`, body);
  }

  get(ticketId: string, messageId: string): Promise<TicketMessage> {
    return this.fetchOne<TicketMessage>(`/v3/tickets/${ticketId}/messages/${messageId}`);
  }

  update(ticketId: string, messageId: string, body: { body: string }): Promise<TicketMessage> {
    return this.putOne<TicketMessage>(`/v3/tickets/${ticketId}/messages/${messageId}`, body);
  }

  delete(ticketId: string, messageId: string): Promise<void> {
    return this.deleteOne(`/v3/tickets/${ticketId}/messages/${messageId}`);
  }

  restore(ticketId: string, messageId: string): Promise<TicketMessage> {
    return this.patchOne<TicketMessage>(`/v3/tickets/${ticketId}/messages/${messageId}/restore`, {});
  }
}

export class TicketAttachmentsResource extends BaseResource {
  list(ticketId: string, options?: PaginationOptions): Promise<Page<TicketAttachment>> {
    return this.fetchList<TicketAttachment>(`/v3/tickets/${ticketId}/attachments`, options);
  }

  create(ticketId: string, formData: FormData): Promise<TicketAttachment> {
    return this.uploadFormData<TicketAttachment>(`/v3/tickets/${ticketId}/attachments`, formData);
  }

  get(ticketId: string, attachmentId: string): Promise<TicketAttachment> {
    return this.fetchOne<TicketAttachment>(`/v3/tickets/${ticketId}/attachments/${attachmentId}`);
  }

  delete(ticketId: string, attachmentId: string): Promise<void> {
    return this.deleteOne(`/v3/tickets/${ticketId}/attachments/${attachmentId}`);
  }
}

export class TicketTagsResource extends BaseResource {
  list(ticketId: string, options?: PaginationOptions): Promise<Page<TicketTicketTag>> {
    return this.fetchList<TicketTicketTag>(`/v3/tickets/${ticketId}/tags`, options);
  }

  create(ticketId: string, body: { id: string }): Promise<TicketTicketTag> {
    return this.postOne<TicketTicketTag>(`/v3/tickets/${ticketId}/tags`, body);
  }

  delete(ticketId: string, tagId: string): Promise<void> {
    return this.deleteOne(`/v3/tickets/${ticketId}/tags/${tagId}`);
  }
}

export class TicketsResource extends BaseResource {
  readonly messages: TicketMessagesResource;
  readonly attachments: TicketAttachmentsResource;
  readonly tags: TicketTagsResource;

  constructor(http: HttpClient) {
    super(http);
    this.messages = new TicketMessagesResource(http);
    this.attachments = new TicketAttachmentsResource(http);
    this.tags = new TicketTagsResource(http);
  }

  batch(ids: string[]): Promise<Ticket[]> {
    return this.fetchBatch<Ticket>("/v3/tickets/batch", ids);
  }

  get(ticketId: string): Promise<Ticket> {
    return this.fetchOne<Ticket>(`/v3/tickets/${ticketId}`);
  }

  update(ticketId: string, body: { status?: string | null; hidden?: boolean | null }): Promise<Ticket> {
    return this.putOne<Ticket>(`/v3/tickets/${ticketId}`, body);
  }

  async uploadLog(logRequestId: string, formData: FormData): Promise<void> {
    await this.uploadFormData(`/v3/tickets/log-requests/${logRequestId}`, formData);
  }
}
