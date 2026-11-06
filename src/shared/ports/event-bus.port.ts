import type { DomainEvent } from '../kernel/domain-event';

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: ReadonlyArray<DomainEvent>): Promise<void>;
  subscribe<T extends DomainEvent = DomainEvent>(
    eventName: string,
    handler: EventHandler<T>,
  ): () => void;
}
