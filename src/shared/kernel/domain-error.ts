export abstract class DomainError extends Error {
  public abstract readonly code: string;
  public readonly timestamp: Date;

  protected constructor(
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends DomainError {
  public readonly code = 'NOT_FOUND' as const;
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} was not found`, { entityName, id });
  }
}

export class ValidationError extends DomainError {
  public readonly code = 'VALIDATION_ERROR' as const;
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}

export class ConflictError extends DomainError {
  public readonly code = 'CONFLICT' as const;
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}

export class UnauthorizedError extends DomainError {
  public readonly code = 'UNAUTHORIZED' as const;
  constructor(message = 'Authentication required') {
    super(message);
  }
}

export class ForbiddenError extends DomainError {
  public readonly code = 'FORBIDDEN' as const;
  constructor(message = 'Access forbidden') {
    super(message);
  }
}

export class DomainRuleViolationError extends DomainError {
  public readonly code = 'RULE_VIOLATION' as const;
  constructor(rule: string, message: string) {
    super(message, { rule });
  }
}
