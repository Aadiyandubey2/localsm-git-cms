import { apiClient } from './client';
import { getCached, setCache } from './cache';

type ApiListResponse<T> = {
	success: boolean;
	data: T[];
};

type ApiSingleResponse<T> = {
	success: boolean;
	message?: string;
	data: T;
};

export type NavigationItem = {
	label: string;
	href: string;
};

export type NavigationDocument = {
	logo?: string;
	menuItems: NavigationItem[];
	ctaLabel?: string;
	ctaHref?: string;
	isActive?: boolean;
};

export type HeroDocument = {
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

export type FounderDocument = {
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

export type BusinessDocument = {
	title: string;
	description?: string;
	image?: string;
	points?: BusinessPoint[];
	ctaText?: string;
	ctaLink?: string;
	isActive?: boolean;
	sortOrder?: number;
};

export type FooterLink = {
	label: string;
	href: string;
};

export type SocialLink = {
	platform: string;
	url: string;
};

export type FooterDocument = {
	logo?: string;
	description?: string;
	links?: FooterLink[];
	socialLinks?: SocialLink[];
	copyrightText?: string;
	isActive?: boolean;
};

export type BrandingDocument = {
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

export type WebsiteSettingsDocument = {
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

export type ContactSubmission = {
	name: string;
	email: string;
	phone?: string;
	subject?: string;
	message: string;
};

export type HomepageDocument = {
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

export type CulturePageDocument = {
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

export type ImpactPageDocument = {
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

export type CareersPageDocument = {
	heroTitle?: string;
	heroDescription?: string;
	philosophyTitle?: string;
	philosophySubtitle?: string;
	principles?: Array<{ label: string; title: string; description: string }>;
	isActive?: boolean;
};

export type JobDocument = {
	title: string;
	department: string;
	location: string;
	type: string;
	description?: string;
	isActive?: boolean;
};

export type ContactPageDocument = {
	heroTitle?: string;
	heroDescription?: string;
	departmentalContacts?: Array<{ label: string; email: string; description: string }>;
	formTitle?: string;
	formInstructions?: string;
	officeSectionTitle?: string;
	officeSectionSubtitle?: string;
	isActive?: boolean;
};

export type OfficeDocument = {
	city: string;
	address: string;
	phone?: string;
	sortOrder?: number;
	isActive?: boolean;
};

export type InvestorsPageDocument = {
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
	showStockWidget?: boolean;
	showStockGraph?: boolean;
	isActive?: boolean;
};

export type FinancialReportDocument = {
	period: string;
	revenue: string;
	growth: string;
	profit: string;
	sortOrder?: number;
	isActive?: boolean;
};

export type ShareholdingPatternDocument = {
	category: string;
	percentage: string;
	sortOrder?: number;
	isActive?: boolean;
};

export type BoardMemberDocument = {
	name: string;
	role: string;
	bio?: string;
	sortOrder?: number;
	isActive?: boolean;
};

// ─── Cached API functions ────────────────────────────────────────────

/**
 * Fetches a collection from the API with localStorage caching.
 * Returns cached data immediately, then refreshes in background.
 */
export const getCollection = async <T>(path: string): Promise<T[]> => {
	const cacheKey = `col_${path}`;
	try {
		const response = await apiClient.get<ApiListResponse<T>>(path);
		const data = response.data?.data;
		const result = data && !Array.isArray(data) ? [data] as unknown as T[] : (data ?? []) as T[];
		setCache(cacheKey, result);
		return result;
	} catch {
		// On network failure, try serving from cache
		return getCached<T[]>(cacheKey) ?? [];
	}
};

/**
 * Fetches a single active document from the API with localStorage caching.
 */
export const getActiveDocument = async <T extends { isActive?: boolean }>(path: string): Promise<T | null> => {
	const cacheKey = `doc_${path}`;
	try {
		const items = await getCollection<T>(path);
		const result = items.find((item) => item.isActive !== false) ?? items[0] ?? null;
		if (result) {
			setCache(cacheKey, result);
		}
		return result;
	} catch {
		return getCached<T>(cacheKey) ?? null;
	}
};

export const getActiveBusinesses = async (): Promise<BusinessDocument[]> => {
	const cacheKey = 'col_businesses_active';
	try {
		const businesses = await getCollection<BusinessDocument>('/businesses');
		const active = businesses.filter((item) => item.isActive !== false);
		const list = active.length > 0 ? active : businesses;
		const result = [...list].sort((a, b) => ((a as BusinessDocument & { sortOrder?: number }).sortOrder ?? 0) - ((b as BusinessDocument & { sortOrder?: number }).sortOrder ?? 0));
		setCache(cacheKey, result);
		return result;
	} catch {
		return getCached<BusinessDocument[]>(cacheKey) ?? [];
	}
};

export const submitContact = async (payload: ContactSubmission): Promise<void> => {
	await apiClient.post<ApiSingleResponse<unknown>>('/contacts', payload);
};

export const splitFooterDescription = (description: string) => {
	const parts = description.split('. ');
	if (parts.length >= 2) {
		return {
			tagline: `${parts[0]}.`,
			body: parts.slice(1).join('. '),
		};
	}
	return { tagline: description, body: '' };
};
