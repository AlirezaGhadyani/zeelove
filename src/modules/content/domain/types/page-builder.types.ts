export type PageType = 'home' | 'landing' | 'custom';

export type PageVersionStatus = 'draft' | 'published' | 'archived';

export type RowWidth = 'narrow' | 'default' | 'wide' | 'full-bleed';

export type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type RowAlignment = 'start' | 'center' | 'end' | 'stretch';

export interface BreakpointVisibility {
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
}

export interface RowBackground {
  type: 'none' | 'color' | 'image' | 'gradient';
  value?: string;
  overlayOpacity?: number;
}

export interface BlockInstance<TProps = Record<string, unknown>> {
  id: string;
  type: string;
  schemaVersion: number;
  props: TProps;
  visibility?: BreakpointVisibility;
}

export interface ColumnLayout {
  id: string;
  span: number; // 1 to 12 in 12-column grid system
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  blocks: BlockInstance[];
}

export interface RowLayout {
  id: string;
  width: RowWidth;
  columnsCount: number; // 1 to 6
  columns: ColumnLayout[];
  gap: SpacingSize;
  paddingY: SpacingSize;
  paddingX?: SpacingSize;
  background?: RowBackground;
  alignment: RowAlignment;
  visibility?: BreakpointVisibility;
  anchorId?: string;
}

export interface PageSeo {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}
