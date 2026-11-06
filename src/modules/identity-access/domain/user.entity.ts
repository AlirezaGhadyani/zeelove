import { AggregateRoot } from '@/shared/kernel/aggregate-root';
import { MobileNumber } from './mobile-number.vo';
import { type Role, hasPermission } from './roles-permissions';

export interface UserProps {
  id: string;
  mobile: MobileNumber;
  role: Role;
  name?: string | null;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot<string> {
  private _mobile: MobileNumber;
  private _role: Role;
  private _name?: string | null;
  private _status: 'ACTIVE' | 'SUSPENDED';
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    super(props.id);
    this._mobile = props.mobile;
    this._role = props.role;
    this._name = props.name;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get mobile(): MobileNumber {
    return this._mobile;
  }

  public get role(): Role {
    return this._role;
  }

  public get name(): string | null | undefined {
    return this._name;
  }

  public get status(): 'ACTIVE' | 'SUSPENDED' {
    return this._status;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public isActive(): boolean {
    return this._status === 'ACTIVE';
  }

  public hasPermission(permission: string): boolean {
    if (!this.isActive()) return false;
    return hasPermission(this._role, permission);
  }

  public updateProfile(name?: string | null): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  public updateRole(newRole: Role): void {
    this._role = newRole;
    this._updatedAt = new Date();
  }
}
