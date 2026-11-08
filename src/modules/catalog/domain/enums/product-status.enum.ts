export const ProductStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ProductStatusType = (typeof ProductStatus)[keyof typeof ProductStatus];
