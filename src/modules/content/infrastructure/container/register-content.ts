import type { Container } from '@/shared/infrastructure/container/container';
import { createToken, TOKENS } from '@/shared/infrastructure/container/tokens';
import type { NavigationRepositoryPort } from '../../application/ports/navigation.repository.port';
import type { PageRepositoryPort } from '../../application/ports/page.repository.port';
import type { NewsletterRepositoryPort } from '../../application/ports/newsletter.repository.port';
import { PrismaNavigationRepository } from '../adapters/prisma-navigation.repository';
import { PrismaPageRepository } from '../adapters/prisma-page.repository';
import { PrismaNewsletterRepository } from '../adapters/prisma-newsletter.repository';
import { GetMenuUseCase } from '../../application/use-cases/get-menu.use-case';
import { ManageMenuUseCase } from '../../application/use-cases/manage-menu.use-case';
import { GetPageUseCase } from '../../application/use-cases/get-page.use-case';
import { ManagePageUseCase } from '../../application/use-cases/manage-page.use-case';
import { SubscribeNewsletterUseCase } from '../../application/use-cases/subscribe-newsletter.use-case';

export const CONTENT_TOKENS = {
  NavigationRepository: createToken<NavigationRepositoryPort>('NavigationRepository'),
  PageRepository: createToken<PageRepositoryPort>('PageRepository'),
  NewsletterRepository: createToken<NewsletterRepositoryPort>('NewsletterRepository'),
  GetMenuUseCase: createToken<GetMenuUseCase>('GetMenuUseCase'),
  ManageMenuUseCase: createToken<ManageMenuUseCase>('ManageMenuUseCase'),
  GetPageUseCase: createToken<GetPageUseCase>('GetPageUseCase'),
  ManagePageUseCase: createToken<ManagePageUseCase>('ManagePageUseCase'),
  SubscribeNewsletterUseCase: createToken<SubscribeNewsletterUseCase>('SubscribeNewsletterUseCase'),
} as const;

export function registerContent(container: Container): void {
  container.register(
    CONTENT_TOKENS.NavigationRepository,
    (c) => new PrismaNavigationRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );

  container.register(
    CONTENT_TOKENS.PageRepository,
    (c) => new PrismaPageRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );

  container.register(
    CONTENT_TOKENS.NewsletterRepository,
    (c) => new PrismaNewsletterRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );

  container.register(
    CONTENT_TOKENS.GetMenuUseCase,
    (c) => new GetMenuUseCase(c.resolve(CONTENT_TOKENS.NavigationRepository)),
    'singleton',
  );

  container.register(
    CONTENT_TOKENS.ManageMenuUseCase,
    (c) => new ManageMenuUseCase(c.resolve(CONTENT_TOKENS.NavigationRepository)),
    'singleton',
  );

  container.register(
    CONTENT_TOKENS.GetPageUseCase,
    (c) => new GetPageUseCase(c.resolve(CONTENT_TOKENS.PageRepository)),
    'singleton',
  );

  container.register(
    CONTENT_TOKENS.ManagePageUseCase,
    (c) => new ManagePageUseCase(c.resolve(CONTENT_TOKENS.PageRepository)),
    'singleton',
  );

  container.register(
    CONTENT_TOKENS.SubscribeNewsletterUseCase,
    (c) => new SubscribeNewsletterUseCase(c.resolve(CONTENT_TOKENS.NewsletterRepository)),
    'singleton',
  );
}
