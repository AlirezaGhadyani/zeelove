export type Result<T, E> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  readonly isOk = true as const;
  readonly isErr = false as const;

  constructor(readonly value: T) {}

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return ok(fn(this.value));
  }

  mapErr<F>(_fn: (error: E) => F): Result<T, F> {
    return ok(this.value);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }
}

export class Err<T, E> {
  readonly isOk = false as const;
  readonly isErr = true as const;

  constructor(readonly error: E) {}

  unwrap(): T {
    throw this.error instanceof Error ? this.error : new Error(String(this.error));
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  map<U>(_fn: (value: T) => U): Result<U, E> {
    return err(this.error);
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return err(fn(this.error));
  }

  flatMap<U>(_fn: (value: T) => Result<U, E>): Result<U, E> {
    return err(this.error);
  }
}

export function ok<T, E = never>(value: T): Result<T, E> {
  return new Ok<T, E>(value);
}

export function err<T = never, E = unknown>(error: E): Result<T, E> {
  return new Err<T, E>(error);
}
