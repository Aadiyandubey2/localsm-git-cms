export type MongoDocument = {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUser = MongoDocument & {
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  avatar?: string;
  isActive?: boolean;
};

export type HeroDoc = MongoDocument & {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive?: boolean;
};

export type FounderDoc = MongoDocument & {
  name: string;
  title?: string;
  message?: string;
  signatureImage?: string;
  portraitImage?: string;
  quote?: string;
  isActive?: boolean;
};

export type BusinessPoint = {
  title: string;
  description?: string;
};

export type BusinessDoc = MongoDocument & {
  title: string;
  description?: string;
  image?: string;
  points?: BusinessPoint[];
  ctaText?: string;
  ctaLink?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type NavigationItem = {
  label: string;
  href: string;
};

export type NavigationDoc = MongoDocument & {
  logo?: string;
  menuItems: NavigationItem[];
  ctaLabel?: string;
  ctaHref?: string;
  isActive?: boolean;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type FooterDoc = MongoDocument & {
  logo?: string;
  description?: string;
  links?: FooterLink[];
  socialLinks?: SocialLink[];
  copyrightText?: string;
  isActive?: boolean;
};

export type BrandingDoc = MongoDocument & {
  siteName: string;
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  isActive?: boolean;
};

export type WebsiteSettingsDoc = MongoDocument & {
  siteName: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: SocialLink[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  isActive?: boolean;
};

export type ContactDoc = MongoDocument & {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status?: 'new' | 'read' | 'replied' | 'archived';
  isRead?: boolean;
};

export type MediaItem = {
  id: string;
  url: string;
  publicId?: string;
  name: string;
  uploadedAt: string;
};

export type ApiListResponse<T> = {
  success: boolean;
  data: T[];
};

export type ApiSingleResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type LoginResponse = {
  admin: AdminUser;
  token: string;
};

export type UploadResponse = {
  secure_url?: string;
  url?: string;
  public_id?: string;
  original_filename?: string;
};
