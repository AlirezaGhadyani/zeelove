import type { ReactNode } from 'react';

export interface AdminColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

export interface AdminFormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'switch' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  defaultValue?: unknown;
}

export interface AdminResourceDefinition<T = Record<string, unknown>> {
  name: string;
  slug: string;
  title: string;
  description?: string;
  columns: AdminColumn<T>[];
  fields: AdminFormField[];
  actions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  };
}

export function defineAdminResource<T>(
  config: AdminResourceDefinition<T>,
): AdminResourceDefinition<T> {
  return {
    actions: { canCreate: true, canEdit: true, canDelete: true, ...config.actions },
    ...config,
  };
}
