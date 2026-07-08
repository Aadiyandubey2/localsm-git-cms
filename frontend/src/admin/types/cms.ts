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

export type FounderPillar = {
  numberLabel: string;
  title: string;
  description: string;
};

export type FounderDoc = MongoDocument & {
  name: string;
  title?: string;
  message?: string;
  signatureImage?: string;
  portraitImage?: string;
  quote?: string;
  letterDate?: string;
  readTime?: string;
  letterTitle?: string;
  introduction?: string;
  calloutQuote?: string;
  middleText?: string;
  pillars?: FounderPillar[];
  conclusion?: string;
  signOffLabel?: string;
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
  wordmarkText?: string;
  wordmarkHighlightIndex?: number;
  wordmarkHighlightColor?: string;
  isActive?: boolean;
};

export type WebsiteSettingsDoc = MongoDocument & {
  siteName: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  cin?: string;
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

export type HomepageDoc = MongoDocument & {
  heroImageCaption?: string;
  heroImageCode?: string;
  founderTeaser?: string;
  founderLetterDate?: string;
  businessSectionSubtitle?: string;
  visionTitle?: string;
  visionDescription?: string;
  missionTitle?: string;
  missionDescription?: string;
  impactMetrics?: Array<{ category: string; value: string; description: string }>;
  cultureTeaserSubtitle?: string;
  cultureTeaserTitle?: string;
  cultureTeaserDescription?: string;
  cultureTeaserImage?: string;
  isActive?: boolean;
};

export type CulturePageDoc = MongoDocument & {
  heroTitle?: string;
  heroDescription?: string;
  philosophyImage?: string;
  philosophyImageAlt?: string;
  philosophyQuote?: string;
  philosophyBody?: string[];
  valuesTitle?: string;
  valuesSubtitle?: string;
  valuesList?: Array<{ num: string; title: string; description: string }>;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  isActive?: boolean;
};

export type ImpactPageDoc = MongoDocument & {
  heroTitle?: string;
  heroDescription?: string;
  metricsTitle?: string;
  metricsSubtitle?: string;
  metrics?: Array<{ label: string; value: string; subText: string }>;
  initiativesTitle?: string;
  initiativesSubtitle?: string;
  initiatives?: Array<{ iconType: string; title: string; description: string }>;
  socialTitle?: string;
  socialDescription?: string;
  socialImage?: string;
  socialImageAlt?: string;
  isActive?: boolean;
};

export type CareersPageDoc = MongoDocument & {
  heroTitle?: string;
  heroDescription?: string;
  philosophyTitle?: string;
  philosophySubtitle?: string;
  principles?: Array<{ label: string; title: string; description: string }>;
  isActive?: boolean;
};

export type JobDoc = MongoDocument & {
  title: string;
  department: string;
  location: string;
  type: string;
  description?: string;
  isActive?: boolean;
};

export type ContactPageDoc = MongoDocument & {
  heroTitle?: string;
  heroDescription?: string;
  departmentalContacts?: Array<{ label: string; email: string; description: string }>;
  formTitle?: string;
  formInstructions?: string;
  officeSectionTitle?: string;
  officeSectionSubtitle?: string;
  isActive?: boolean;
};

export type OfficeDoc = MongoDocument & {
  city: string;
  address: string;
  phone?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type InvestorsPageDoc = MongoDocument & {
  heroTitle?: string;
  heroDescription?: string;
  stockSymbol?: string;
  stockIsin?: string;
  stockBasePrice?: number;
  marketCap?: string;
  peRatio?: string;
  fiftyTwoWeekHigh?: string;
  fiftyTwoWeekLow?: string;
  ytdPerformance?: string;
  chartStartDate?: string;
  chartEndDate?: string;
  isActive?: boolean;
};

export type FinancialReportDoc = MongoDocument & {
  period: string;
  revenue: string;
  growth: string;
  profit: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type ShareholdingPatternDoc = MongoDocument & {
  category: string;
  percentage: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type BoardMemberDoc = MongoDocument & {
  name: string;
  role: string;
  bio?: string;
  sortOrder?: number;
  isActive?: boolean;
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
