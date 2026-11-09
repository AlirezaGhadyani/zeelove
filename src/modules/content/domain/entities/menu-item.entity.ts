export interface MenuItemProps {
  id: string;
  menuId: string;
  parentId?: string | null;
  title: string;
  url: string;
  target?: string;
  displayOrder: number;
  isActive: boolean;
  children?: MenuItem[];
}

export class MenuItem {
  public readonly id: string;
  public readonly menuId: string;
  public parentId?: string | null;
  public title: string;
  public url: string;
  public target: string;
  public displayOrder: number;
  public isActive: boolean;
  public children: MenuItem[];

  constructor(props: MenuItemProps) {
    this.id = props.id;
    this.menuId = props.menuId;
    this.parentId = props.parentId ?? null;
    this.title = props.title.trim();
    this.url = props.url.trim();
    this.target = props.target || '_self';
    this.displayOrder = props.displayOrder;
    this.isActive = props.isActive;
    this.children = props.children ? [...props.children] : [];
  }
}
