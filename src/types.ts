export type ToolCategory =
  | 'ai-chat'
  | 'images-design'
  | 'video'
  | 'audio-music'
  | 'writing-content'
  | 'programming'
  | 'productivity'
  | 'seo-marketing'
  | 'other';

export type PricingType = 'Free' | 'Freemium' | 'Paid';

export interface LocalizedFeatures {
  ar: string[];
  en: string[];
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  longDescriptionAr: string;
  longDescriptionEn: string;
  category: ToolCategory;
  subcategory: string;
  pricing: PricingType;
  officialUrl: string;
  icon: string;
  brandColor?: string;
  features: LocalizedFeatures;
  keywords: string[];
  tags: string[];
  featured: boolean;
  isNew: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  popularityScore: number;
}

export interface Category {
  id: ToolCategory;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export type SortOption =
  | 'popular'
  | 'newest'
  | 'name-asc'
  | 'name-ar'
  | 'free-first';

export interface ToolFilterOptions {
  category?: ToolCategory | 'all';
  pricing?: PricingType | 'all';
  featured?: boolean;
  isNew?: boolean;
  searchQuery?: string;
  sortBy?: SortOption;
}

export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light';

export interface SeoMetadata {
  title: string;
  metaDescription: string;
  canonicalSlug: string;
}
