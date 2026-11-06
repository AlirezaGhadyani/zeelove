import { describe, it, expect, vi } from 'vitest';
import { InProcessEventBus } from '@/shared/infrastructure/events/in-process-event-bus';
import { FakeUnitOfWork } from '@/shared/testing/fakes/fake-unit-of-work';
import type { DomainEvent } from '@/shared/kernel/domain-event';

describe('InProcessEventBus', () => {
  it('publishes events to subscribed handlers', async () => {
    const bus = new InProcessEventBus();
    const handler = vi.fn();

    const unsubscribe = bus.subscribe('order.placed', handler);

    const event: DomainEvent = {
      eventId: 'evt-100',
      eventName: 'order.placed',
      aggregateId: 'ord-1',
      occurredOn: new Date(),
    };

    await bus.publish(event);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);

    unsubscribe();
    await bus.publish(event);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('stages events for after-commit dispatch using UnitOfWork', async () => {
    const bus = new InProcessEventBus();
    const uow = new FakeUnitOfWork();
    const handler = vi.fn();

    bus.subscribe('order.paid', handler);

    const event: DomainEvent = {
      eventId: 'evt-200',
      eventName: 'order.paid',
      aggregateId: 'ord-2',
      occurredOn: new Date(),
    };

    bus.publishAfterCommit([event], uow);
    expect(handler).not.toHaveBeenCalled();

    await uow.execute(async () => {
      // simulate transactional work
      return true;
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
