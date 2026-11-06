import { ValueObject } from './value-object';
import { DomainRuleViolationError } from './domain-error';

interface IdProps {
  value: string;
}

export class UniqueId extends ValueObject<IdProps> {
  protected constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainRuleViolationError('INVALID_ID', 'ID cannot be empty');
    }
    super({ value: value.trim() });
  }

  public static create(value: string): UniqueId {
    return new UniqueId(value);
  }

  public get value(): string {
    return this.props.value;
  }

  public toString(): string {
    return this.props.value;
  }
}

export class AggregateId extends UniqueId {
  private constructor(
    value: string,
    readonly entityName: string,
  ) {
    super(value);
  }

  public static override create(value: string, entityName = 'Aggregate'): AggregateId {
    return new AggregateId(value, entityName);
  }
}
