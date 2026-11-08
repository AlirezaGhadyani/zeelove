import { Entity } from '@/shared/kernel/entity';

export type AttributeType = 'TEXT' | 'NUMBER' | 'SELECT';

export interface AttributeProps {
  id: string;
  name: string;
  code: string;
  type: AttributeType;
  options?: string[];
  createdAt?: Date;
}

export class Attribute extends Entity<string> {
  private _name: string;
  private _code: string;
  private _type: AttributeType;
  private _options?: string[];
  private _createdAt: Date;

  constructor(props: AttributeProps) {
    super(props.id);
    this._name = props.name;
    this._code = props.code;
    this._type = props.type;
    this._options = props.options;
    this._createdAt = props.createdAt ?? new Date();
  }

  public get name(): string {
    return this._name;
  }
  public get code(): string {
    return this._code;
  }
  public get type(): AttributeType {
    return this._type;
  }
  public get options(): string[] | undefined {
    return this._options;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }

  public update(props: Partial<Pick<AttributeProps, 'name' | 'code' | 'type' | 'options'>>): void {
    if (props.name !== undefined) this._name = props.name;
    if (props.code !== undefined) this._code = props.code;
    if (props.type !== undefined) this._type = props.type;
    if (props.options !== undefined) this._options = props.options;
  }
}

export interface ProductAttributeValueProps {
  id: string;
  productId: string;
  attributeId: string;
  value: string;
}

export class ProductAttributeValue extends Entity<string> {
  private _productId: string;
  private _attributeId: string;
  private _value: string;

  constructor(props: ProductAttributeValueProps) {
    super(props.id);
    this._productId = props.productId;
    this._attributeId = props.attributeId;
    this._value = props.value;
  }

  public get productId(): string {
    return this._productId;
  }
  public get attributeId(): string {
    return this._attributeId;
  }
  public get value(): string {
    return this._value;
  }
  public setValue(val: string): void {
    this._value = val;
  }
}
