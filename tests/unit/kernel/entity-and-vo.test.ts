import { describe, it, expect } from 'vitest';
import { Entity } from '@/shared/kernel/entity';
import { ValueObject } from '@/shared/kernel/value-object';
import { AggregateRoot } from '@/shared/kernel/aggregate-root';
import type { DomainEvent } from '@/shared/kernel/domain-event';

class TestEntity extends Entity<string> {
  constructor(
    id: string,
    public name: string,
  ) {
    super(id);
  }
}

interface AddressProps {
  city: string;
  postalCode: string;
}

class AddressVO extends ValueObject<AddressProps> {
  constructor(props: AddressProps) {
    super(props);
  }
}

class SampleAggregate extends AggregateRoot<string> {
  constructor(id: string) {
    super(id);
  }

  public recordAction(name: string): void {
    const event: DomainEvent = {
      eventId: 'evt-1',
      eventName: 'action.recorded',
      aggregateId: this.id,
      occurredOn: new Date(),
    };
    this.addDomainEvent(event);
  }
}

describe('Entity & ValueObject & AggregateRoot', () => {
  it('entities are equal if they have the same ID', () => {
    const e1 = new TestEntity('123', 'A');
    const e2 = new TestEntity('123', 'B');
    const e3 = new TestEntity('456', 'A');

    expect(e1.equals(e2)).toBe(true);
    expect(e1.equals(e3)).toBe(false);
    expect(e1.equals(null)).toBe(false);
  });

  it('value objects are structurally equal', () => {
    const a1 = new AddressVO({ city: 'Tehran', postalCode: '12345' });
    const a2 = new AddressVO({ city: 'Tehran', postalCode: '12345' });
    const a3 = new AddressVO({ city: 'Isfahan', postalCode: '12345' });

    expect(a1.equals(a2)).toBe(true);
    expect(a1.equals(a3)).toBe(false);
  });

  it('aggregate root collects, retrieves, and clears domain events', () => {
    const agg = new SampleAggregate('agg-1');
    expect(agg.getDomainEvents()).toHaveLength(0);

    agg.recordAction('test');
    expect(agg.getDomainEvents()).toHaveLength(1);
    expect(agg.getDomainEvents()[0]?.eventName).toBe('action.recorded');

    agg.clearDomainEvents();
    expect(agg.getDomainEvents()).toHaveLength(0);
  });
});
