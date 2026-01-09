import type { $Fetch } from 'nitropack';
import type { RuntimeConfig } from 'nuxt/schema';

export interface CreateFeedbackDto {
  email: string;
  subject: string;
  message: string;
}

export class FeedbackService {
  constructor(
    protected api: $Fetch,
    protected runtimeConfig: RuntimeConfig
  ) {}

  createFeedback(body: CreateFeedbackDto) {
    return this.api(`/feedback`, {
      method: 'post',
      body
    });
  }
}

