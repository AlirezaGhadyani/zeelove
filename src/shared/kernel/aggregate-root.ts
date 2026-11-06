import { Entity } from './entity';
import type { DomainEvent } from './domain-event';

export abstract class AggregateRoot<TId> extends Entity<TId> {
  private readonly _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public getDomainEvents(): ReadonlyArray<DomainEvent> {
    return Object.freeze([...this._domainEvents]);
  }

  public clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }
}
