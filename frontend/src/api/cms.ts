import { apiClient } from './client';

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

export const fallbackNavigation: NavigationDocument = {
	logo: '/images/localsm-logo.svg',
	menuItems: [
		{ label: 'Home', href: '/' },
		{ label: 'Culture', href: '/culture' },
		{ label: 'Careers', href: '/careers' },
		{ label: 'Investors', href: '/investors' },
		{ label: 'Impact', href: '/impact' },
		{ label: 'Contact', href: '/contact' },
	],
};

export const fallbackBranding: BrandingDocument = {
	siteName: 'LocalSM',
	logo: '/images/localsm-logo.svg',
	favicon: '/favicon.svg',
	primaryColor: '#0055ff',
	secondaryColor: '#f4f4f4',
	accentColor: '#f4b000',
	fontFamily: 'Berkshire Swash',
};

export const fallbackHero: HeroDocument = {
	title: "LocalSM isn't just a name. It's a mission statement.",
	subtitle: 'Corporate Announcement',
	description:
		'We are building enduring infrastructure to connect, empower, and scale local merchants, logistics, and communities. From quick-commerce to local branding, our platforms redefine hyper-local life.',
	image: '/images/hero-building.jpg',
};

export const fallbackFounder: FounderDocument = {
	name: 'Kabir Sharma',
	title: 'Founder & CEO',
	portraitImage: '/images/founder.jpg',
	quote:
		'Our journey has always been about empowering those who make our cities run. As we evolve, our responsibility to build a permanent, resilient, and sustainable ecosystem only deepens.',
};

export const fallbackBusinesses: BusinessDocument[] = [
	{
		title: 'LocalSM Delivery',
		description:
			'Our flagship logistics and food delivery network. Connecting millions of customers with over 500,000 restaurant and merchant partners across 800+ cities with unparalleled efficiency.',
		image: '/images/delivery-rider.jpg',
		points: [{ title: 'Food & More' }],
		ctaText: 'Explore Platform',
		ctaLink: '#',
	},
	{
		title: 'Janhal',
		description:
			'Our ultra-fast commerce arm. Delivering groceries, fresh produce, electronics, and daily essentials to households within 10 minutes, powered by a dense network of hyper-local dark stores.',
		image: '/images/office-interior.jpg',
		points: [{ title: 'Quick Commerce' }],
		ctaText: 'Explore Platform',
		ctaLink: '#',
	},
	{
		title: 'Local Branding Software',
		description:
			'Our proprietary merchant suite. Empowering local store owners to manage digital storefronts, run localized micro-campaigns, and build customer loyalty with advanced marketing analytics.',
		image: '/images/local-merchant.jpg',
		points: [{ title: 'Merchant SaaS' }],
		ctaText: 'Explore Platform',
		ctaLink: '#',
	},
];

export const fallbackFooter: FooterDocument = {
	logo: '/images/localsm-logo.svg',
	description:
		'To endure, evolve, and empower. Building the hyper-local commerce infrastructure of tomorrow.',
	links: [
		{ label: 'LocalSM Delivery', href: '/' },
		{ label: 'Janhal', href: '/' },
		{ label: 'Local Branding Software', href: '/' },
		{ label: 'Culture', href: '/culture' },
		{ label: 'Careers', href: '/careers' },
		{ label: 'Investors', href: '/investors' },
		{ label: 'Impact & Sustainability', href: '/impact' },
		{ label: 'Privacy Policy', href: '#' },
		{ label: 'Terms of Use', href: '#' },
		{ label: 'Sitemap', href: '#' },
	],
	copyrightText: `© ${new Date().getFullYear()} LocalSM Limited. All rights reserved.`,
};

export const fallbackWebsiteSettings: WebsiteSettingsDocument = {
	siteName: 'LocalSM Limited',
	tagline: 'To endure, evolve, and empower.',
	description: 'Building the hyper-local commerce infrastructure of tomorrow.',
	email: 'corporate@localsm.com',
	phone: '+91 124 499 9999',
	address: '12th Floor, DLF Cyber City, Phase 3, Gurugram, Haryana - 122002, India',
};

export const getCollection = async <T>(path: string): Promise<T[]> => {
	const response = await apiClient.get<ApiListResponse<T>>(path);
	return response.data?.data ?? [];
};

export const getActiveDocument = async <T extends { isActive?: boolean }>(path: string): Promise<T | null> => {
	const items = await getCollection<T>(path);
	return items.find((item) => item.isActive !== false) ?? items[0] ?? null;
};

export const getActiveBusinesses = async (): Promise<BusinessDocument[]> => {
	const businesses = await getCollection<BusinessDocument>('/businesses');
	const active = businesses.filter((item) => item.isActive !== false);
	const list = active.length > 0 ? active : businesses;
	return [...list].sort((a, b) => ((a as BusinessDocument & { sortOrder?: number }).sortOrder ?? 0) - ((b as BusinessDocument & { sortOrder?: number }).sortOrder ?? 0));
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
