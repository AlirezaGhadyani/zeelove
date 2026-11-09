import type { PrismaClient } from '@prisma/client';
import type {
  NewsletterRepositoryPort,
  NewsletterSubscriptionData,
} from '../../application/ports/newsletter.repository.port';

export class PrismaNewsletterRepository implements NewsletterRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async subscribe(
    data: NewsletterSubscriptionData,
  ): Promise<{ id: string; success: boolean }> {
    const rec = await this.prisma.newsletterSubscriber.create({
      data: {
        email: data.email,
        mobile: data.mobile,
        source: data.source || 'storefront_block',
      },
    });
    return { id: rec.id, success: true };
  }

  public async isSubscribed(identifier: string): Promise<boolean> {
    const clean = identifier.trim().toLowerCase();
    const isEmail = clean.includes('@');

    const found = await this.prisma.newsletterSubscriber.findFirst({
      where: isEmail ? { email: clean } : { mobile: clean.replace(/\D/g, '') },
    });
    return !!found;
  }
}
