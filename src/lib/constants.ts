export const TAX_RATE = 0.06875;
export const MAX_PRICE_FILTER = 120;

export const CATEGORY_OPTIONS = [
  'FLOWER',
  'EDIBLES',
  'VAPES',
  'CONCENTRATES',
  'ACCESSORIES',
] as const;

export type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

export const SORT_OPTIONS = ['newest', 'price_asc', 'price_desc'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];
