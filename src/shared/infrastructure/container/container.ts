import type { InjectionToken } from './tokens';

export type Lifetime = 'singleton' | 'transient';

interface Binding<T> {
  factory: (container: Container) => T;
  lifetime: Lifetime;
  instance?: T;
}

export class Container {
  private readonly bindings = new Map<string, Binding<unknown>>();

  constructor(private readonly parent?: Container) {}

  public register<T>(
    token: InjectionToken<T>,
    factory: (container: Container) => T,
    lifetime: Lifetime = 'singleton',
  ): this {
    this.bindings.set(token.name, {
      factory: factory as (container: Container) => unknown,
      lifetime,
    });
    return this;
  }

  public registerInstance<T>(token: InjectionToken<T>, instance: T): this {
    this.bindings.set(token.name, {
      factory: () => instance,
      lifetime: 'singleton',
      instance,
    });
    return this;
  }

  public resolve<T>(token: InjectionToken<T>): T {
    const binding = this.bindings.get(token.name);
    if (binding) {
      if (binding.lifetime === 'singleton') {
        if (binding.instance === undefined) {
          binding.instance = binding.factory(this);
        }
        return binding.instance as T;
      }
      return binding.factory(this) as T;
    }

    if (this.parent) {
      return this.parent.resolve(token);
    }

    throw new Error(`[DI] No provider registered for token "${token.name}"`);
  }

  public has(token: InjectionToken<unknown>): boolean {
    return this.bindings.has(token.name) || (this.parent?.has(token) ?? false);
  }

  public createChild(): Container {
    return new Container(this);
  }
}
