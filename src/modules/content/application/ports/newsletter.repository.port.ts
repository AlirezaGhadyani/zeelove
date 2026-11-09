export interface NewsletterSubscriptionData {
  email?: string;
  mobile?: string;
  source?: string;
}

export interface NewsletterRepositoryPort {
  subscribe(data: NewsletterSubscriptionData): Promise<{ id: string; success: boolean }>;
  isSubscribed(identifier: string): Promise<boolean>;
}
