import type { DomainEvent } from '@/shared/kernel/domain-event';
import type { EventBus, EventHandler } from '@/shared/ports/event-bus.port';
import type { UnitOfWork } from '@/shared/ports/unit-of-work.port';
import type { LoggerPort } from '@/shared/ports/logger.port';

export class InProcessEventBus implements EventBus {
  private readonly handlers = new Map<string, Set<EventHandler<DomainEvent>>>();

  constructor(private readonly logger?: LoggerPort) {}

  public subscribe<T extends DomainEvent = DomainEvent>(
    eventName: string,
    handler: EventHandler<T>,
  ): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    const set = this.handlers.get(eventName)!;
    const genericHandler = handler as unknown as EventHandler<DomainEvent>;
    set.add(genericHandler);

    return () => {
      set.delete(genericHandler);
      if (set.size === 0) {
        this.handlers.delete(eventName);
      }
    };
  }

  public async publish(event: DomainEvent): Promise<void> {
    const matching = this.handlers.get(event.eventName);
    if (!matching || matching.size === 0) {
      return;
    }

    const executions = Array.from(matching).map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        this.logger?.error(`Error handling event "${event.eventName}"`, error, {
          eventId: event.eventId,
          aggregateId: event.aggregateId,
        });
      }
    });

    await Promise.all(executions);
  }

  public async publishAll(events: ReadonlyArray<DomainEvent>): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  public publishAfterCommit(events: ReadonlyArray<DomainEvent>, unitOfWork: UnitOfWork): void {
    unitOfWork.registerAfterCommit(async () => {
      await this.publishAll(events);
    });
  }
}
