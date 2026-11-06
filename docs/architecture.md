# Zeelove Architecture Guide

This document describes the architectural foundation and DDD layers for **zeelove** (زیلاو).

## 1. Core Principles

- **RTL & Persian First**: All presentation is designed RTL-first using logical CSS properties, Vazirmatn typography, Persian digits (`۰-۹`), and prices in integer Toman.
- **Strict Hexagonal / Ports & Adapters**: Core domain logic is completely isolated from frameworks, databases, and third-party SDKs.
- **Self-Hosted Autonomy**: All infrastructure components (Postgres, Redis, Caddy) run on standard protocols without proprietary vendor locks.

---

## 2. Layering & Directory Layout

```
src/
├── shared/
│   ├── kernel/          # Pure DDD primitives: Entity, ValueObject, AggregateRoot, Money, Result
│   ├── ports/           # Port interfaces: Clock, IdGenerator, EventBus, UnitOfWork, Cache, RateLimiter
│   ├── infrastructure/  # Framework adapters: Prisma, Redis, Pino, InProcessEventBus, DI Container
│   └── ui/              # RTL primitives, layout components, and commerce UI
└── modules/
    └── <context>/
        ├── domain/          # Pure entities, value objects, domain errors, domain events (NO infra imports)
        ├── application/     # Use cases, application DTOs, repository port interfaces
        ├── infrastructure/  # Prisma repositories, external API clients, adapters
        └── presentation/    # Server actions, Route handlers, React components
```

---

## 3. Dependency Rules

Enforced automatically by `dependency-cruiser` (`npm run arch:check`):

1. **Domain Layer**: May only import from `shared/kernel`. NEVER imports from application, infrastructure, or presentation.
2. **Application Layer**: May import from `domain` and `shared/ports`. NEVER imports from infrastructure or presentation.
3. **Infrastructure Layer**: Implements ports defined in application/shared. May import libraries (`@prisma/client`, `ioredis`).
4. **Presentation Layer**: Dispatches use cases and renders UI.

---

## 4. Shared Kernel

- **`Entity<TId>`**: Base entity with identity-based equality.
- **`ValueObject<TProps>`**: Immutable value object with structural equality.
- **`AggregateRoot<TId>`**: Extends `Entity`, maintains internal uncommitted `DomainEvent[]`.
- **`Money`**: Value object enforcing integer Toman amounts (no floats allowed!), arithmetic (`add`, `subtract`, `multiply`), and Persian formatting.
- **`Result<T, E>`**: Monadic Either/Result pattern (`ok()`, `err()`, `map()`, `flatMap()`, `unwrap()`).
- **`DomainError`**: Standard error hierarchy (`NotFoundError`, `ValidationError`, `ConflictError`, `DomainRuleViolationError`).

---

## 5. Ports & Adapters

| Port Interface    | Default Production Adapter                      | Unit Test Double           |
| :---------------- | :---------------------------------------------- | :------------------------- |
| `Clock`           | `SystemClock`                                   | `FrozenClock`              |
| `IdGenerator`     | `UuidGenerator`                                 | `DeterministicIdGenerator` |
| `EventBus`        | `InProcessEventBus`                             | `InProcessEventBus` / Spy  |
| `UnitOfWork`      | `PrismaUnitOfWork` (interactive `$transaction`) | `FakeUnitOfWork`           |
| `CachePort`       | `RedisCacheAdapter`                             | `InMemoryCacheAdapter`     |
| `RateLimiterPort` | `RedisRateLimiter`                              | `InMemoryRateLimiter`      |
| `LoggerPort`      | `PinoLoggerAdapter`                             | In-memory logger spy       |

---

## 6. End-to-End Concrete Example

### 1. Domain Entity & Event

```typescript
export class Wallet extends AggregateRoot<string> {
  private constructor(
    id: string,
    private _balance: Money,
  ) {
    super(id);
  }

  public deposit(amount: Money): void {
    this._balance = this._balance.add(amount);
    this.addDomainEvent({
      eventId: crypto.randomUUID(),
      eventName: 'wallet.deposited',
      aggregateId: this.id,
      occurredOn: new Date(),
    });
  }

  public get balance(): Money {
    return this._balance;
  }
}
```

### 2. Application Use Case

```typescript
export class DepositFundsUseCase implements UseCase<DepositInput, Result<Money, DomainError>> {
  constructor(
    private readonly walletRepo: WalletRepositoryPort,
    private readonly uow: UnitOfWork,
    private readonly eventBus: InProcessEventBus,
  ) {}

  async execute(input: DepositInput): Promise<Result<Money, DomainError>> {
    return this.uow.execute(async () => {
      const wallet = await this.walletRepo.findById(input.walletId);
      if (!wallet) return err(new NotFoundError('Wallet', input.walletId));

      wallet.deposit(Money.create(input.amountToman));
      await this.walletRepo.save(wallet);

      this.eventBus.publishAfterCommit(wallet.getDomainEvents(), this.uow);
      wallet.clearDomainEvents();

      return ok(wallet.balance);
    });
  }
}
```

---

## 7. Composition Root & DI

```typescript
const container = createAppContainer();
// Module registration hook:
myModule.register(container);
```

---

## 8. Testing Strategy

- **Unit Tests (`npm run test:unit`)**: Fast, pure in-memory execution using `FakeUnitOfWork`, `InMemoryCacheAdapter`, and `DeterministicIdGenerator`.
- **Integration Tests (`npm run test:int`)**: Real PostgreSQL database transactions using `TestDbHarness.withRollback()` to isolate test data.
