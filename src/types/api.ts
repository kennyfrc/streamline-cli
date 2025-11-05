export interface IconSearchResult {
  hash: string;
  name: string;
  imagePreviewUrl: string;
  isFree: boolean;
  familySlug: string;
  familyName: string;
  categorySlug: string;
  categoryName: string;
  subcategorySlug: string;
  subcategoryName: string;
}

export interface PaginationInfo {
  total: number;
  hasMore: boolean;
  offset: number;
  nextOffset: number;
}

export interface SearchResponse {
  query: string;
  results: IconSearchResult[];
  pagination: PaginationInfo;
}

export interface IconDetail {
  hash: string;
  name: string;
  imagePreviewUrl: string;
  isFree: boolean;
  familySlug: string;
  familyName: string;
  categorySlug: string;
  categoryName: string;
  subcategorySlug: string;
  subcategoryName: string;
  colors?: string[];
  tags?: string[];
  description?: string;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export interface GlobalSearchOptions {
  query: string;
  productType?: 'icons' | 'illustrations' | 'emoji' | 'elements';
  limit?: number;
  offset?: number;
  style?: string;
  category?: string;
  freeOnly?: boolean;
}

export interface FamilySearchOptions extends Omit<GlobalSearchOptions, 'query'> {
  familySlug: string;
  query?: string;
}

export interface DownloadSvgOptions {
  responsive?: boolean;
}

export interface DownloadPngOptions {
  size?: number; // API uses a single square dimension.
}
