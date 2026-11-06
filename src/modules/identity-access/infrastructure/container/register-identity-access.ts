import type { Container } from '@/shared/infrastructure/container/container';
import { createToken, TOKENS } from '@/shared/infrastructure/container/tokens';
import { env } from '@/shared/infrastructure/config/env';
import type { UserRepositoryPort } from '../../application/ports/user.repository.port';
import type { SessionRepositoryPort } from '../../application/ports/session.repository.port';
import type { OtpChallengeRepositoryPort } from '../../application/ports/otp-challenge.repository.port';
import type { OtpSender } from '../../application/ports/otp-sender.port';
import { PrismaUserRepository } from '../adapters/prisma-user.repository';
import { PrismaSessionRepository } from '../adapters/prisma-session.repository';
import { PrismaOtpChallengeRepository } from '../adapters/prisma-otp-challenge.repository';
import { DevOtpSender } from '../adapters/dev-otp-sender';
import { ConsoleOtpSender } from '../adapters/console-otp-sender';
import { RequestOtpUseCase } from '../../application/use-cases/request-otp.use-case';
import { VerifyOtpUseCase } from '../../application/use-cases/verify-otp.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { RevokeSessionUseCase } from '../../application/use-cases/revoke-session.use-case';
import { ListSessionsUseCase } from '../../application/use-cases/list-sessions.use-case';

export const IDENTITY_TOKENS = {
  UserRepository: createToken<UserRepositoryPort>('UserRepository'),
  SessionRepository: createToken<SessionRepositoryPort>('SessionRepository'),
  OtpChallengeRepository: createToken<OtpChallengeRepositoryPort>('OtpChallengeRepository'),
  OtpSender: createToken<OtpSender>('OtpSender'),
  RequestOtpUseCase: createToken<RequestOtpUseCase>('RequestOtpUseCase'),
  VerifyOtpUseCase: createToken<VerifyOtpUseCase>('VerifyOtpUseCase'),
  LogoutUseCase: createToken<LogoutUseCase>('LogoutUseCase'),
  GetCurrentUserUseCase: createToken<GetCurrentUserUseCase>('GetCurrentUserUseCase'),
  RevokeSessionUseCase: createToken<RevokeSessionUseCase>('RevokeSessionUseCase'),
  ListSessionsUseCase: createToken<ListSessionsUseCase>('ListSessionsUseCase'),
} as const;

export function registerIdentityAccess(container: Container): void {
  container.register(
    IDENTITY_TOKENS.UserRepository,
    (c) => new PrismaUserRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );
  container.register(
    IDENTITY_TOKENS.SessionRepository,
    (c) => new PrismaSessionRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );
  container.register(
    IDENTITY_TOKENS.OtpChallengeRepository,
    (c) => new PrismaOtpChallengeRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );

  container.register(
    IDENTITY_TOKENS.OtpSender,
    (c) =>
      env.OTP_DEV_MODE
        ? new DevOtpSender(c.resolve(TOKENS.Logger))
        : new ConsoleOtpSender(c.resolve(TOKENS.Logger)),
    'singleton',
  );

  container.register(
    IDENTITY_TOKENS.RequestOtpUseCase,
    (c) =>
      new RequestOtpUseCase(
        c.resolve(IDENTITY_TOKENS.OtpChallengeRepository),
        c.resolve(IDENTITY_TOKENS.OtpSender),
        c.resolve(TOKENS.RateLimiter),
        c.resolve(TOKENS.Clock),
        env.OTP_DEV_MODE,
      ),
    'singleton',
  );

  container.register(
    IDENTITY_TOKENS.VerifyOtpUseCase,
    (c) =>
      new VerifyOtpUseCase(
        c.resolve(IDENTITY_TOKENS.UserRepository),
        c.resolve(IDENTITY_TOKENS.SessionRepository),
        c.resolve(IDENTITY_TOKENS.OtpChallengeRepository),
        c.resolve(TOKENS.Clock),
        env.SEED_SUPER_ADMIN_MOBILE,
      ),
    'singleton',
  );

  container.register(
    IDENTITY_TOKENS.LogoutUseCase,
    (c) => new LogoutUseCase(c.resolve(IDENTITY_TOKENS.SessionRepository)),
    'singleton',
  );

  container.register(
    IDENTITY_TOKENS.GetCurrentUserUseCase,
    (c) =>
      new GetCurrentUserUseCase(
        c.resolve(IDENTITY_TOKENS.SessionRepository),
        c.resolve(IDENTITY_TOKENS.UserRepository),
        c.resolve(TOKENS.Clock),
      ),
    'singleton',
  );

  container.register(
    IDENTITY_TOKENS.RevokeSessionUseCase,
    (c) => new RevokeSessionUseCase(c.resolve(IDENTITY_TOKENS.SessionRepository)),
    'singleton',
  );

  container.register(
    IDENTITY_TOKENS.ListSessionsUseCase,
    (c) => new ListSessionsUseCase(c.resolve(IDENTITY_TOKENS.SessionRepository)),
    'singleton',
  );
}
