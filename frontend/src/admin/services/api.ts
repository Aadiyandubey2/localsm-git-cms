import axios, { type AxiosError } from 'axios';
import type {
  AdminUser,
  ApiListResponse,
  ApiSingleResponse,
  BrandingDoc,
  BusinessDoc,
  ContactDoc,
  FooterDoc,
  FounderDoc,
  HeroDoc,
  LoginResponse,
  NavigationDoc,
  UploadResponse,
  WebsiteSettingsDoc,
  HomepageDoc,
  CulturePageDoc,
  ImpactPageDoc,
  CareersPageDoc,
  JobDoc,
  ContactPageDoc,
  OfficeDoc,
  InvestorsPageDoc,
  FinancialReportDoc,
  ShareholdingPatternDoc,
  BoardMemberDoc,
} from '../types/cms';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api'
    : 'http://localhost:5000/api');
const TOKEN_KEY = 'localsm_admin_token';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong') => {
  const axiosError = error as AxiosError<{ message?: string; errors?: Array<{ msg?: string }> }>;
  const data = axiosError.response?.data;

  if (data?.errors?.length) {
    return data.errors.map((item) => item.msg).filter(Boolean).join(', ') || fallback;
  }

  return data?.message || axiosError.message || fallback;
};

const unwrapList = <T>(response: { data: ApiListResponse<T> }) => response.data.data ?? [];
const unwrapSingle = <T>(response: { data: ApiSingleResponse<T> }) => response.data.data;

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await adminApi.post<ApiSingleResponse<LoginResponse>>('/auth/login', { email, password });
    const data = unwrapSingle(response);
    if (data.token) {
      setStoredToken(data.token);
    }
    return data;
  },
  logout: async () => {
    try {
      await adminApi.post('/auth/logout');
    } finally {
      clearStoredToken();
    }
  },
  me: async () => {
    const response = await adminApi.get<ApiSingleResponse<AdminUser>>('/auth/me');
    return unwrapSingle(response);
  },
};

export const heroesApi = {
  list: () => adminApi.get<ApiListResponse<HeroDoc>>('/heroes').then(unwrapList),
  create: (payload: Partial<HeroDoc>) =>
    adminApi.post<ApiSingleResponse<HeroDoc>>('/heroes', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<HeroDoc>) =>
    adminApi.patch<ApiSingleResponse<HeroDoc>>(`/heroes/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/heroes/${id}`),
};

export const foundersApi = {
  list: () => adminApi.get<ApiListResponse<FounderDoc>>('/founders').then(unwrapList),
  create: (payload: Partial<FounderDoc>) =>
    adminApi.post<ApiSingleResponse<FounderDoc>>('/founders', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<FounderDoc>) =>
    adminApi.patch<ApiSingleResponse<FounderDoc>>(`/founders/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/founders/${id}`),
};

export const businessesApi = {
  list: () => adminApi.get<ApiListResponse<BusinessDoc>>('/businesses').then(unwrapList),
  create: (payload: Partial<BusinessDoc>) =>
    adminApi.post<ApiSingleResponse<BusinessDoc>>('/businesses', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<BusinessDoc>) =>
    adminApi.patch<ApiSingleResponse<BusinessDoc>>(`/businesses/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/businesses/${id}`),
  reorder: async (items: BusinessDoc[]) => {
    await Promise.all(
      items.map((item, index) => businessesApi.update(item._id, { sortOrder: index }))
    );
  },
};

export const navigationApi = {
  list: () => adminApi.get<ApiListResponse<NavigationDoc>>('/navigation').then(unwrapList),
  create: (payload: Partial<NavigationDoc>) =>
    adminApi.post<ApiSingleResponse<NavigationDoc>>('/navigation', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<NavigationDoc>) =>
    adminApi.patch<ApiSingleResponse<NavigationDoc>>(`/navigation/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/navigation/${id}`),
};

export const footerApi = {
  list: () => adminApi.get<ApiListResponse<FooterDoc>>('/footer').then(unwrapList),
  create: (payload: Partial<FooterDoc>) =>
    adminApi.post<ApiSingleResponse<FooterDoc>>('/footer', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<FooterDoc>) =>
    adminApi.patch<ApiSingleResponse<FooterDoc>>(`/footer/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/footer/${id}`),
};

export const brandingApi = {
  list: () => adminApi.get<ApiListResponse<BrandingDoc>>('/branding').then(unwrapList),
  create: (payload: Partial<BrandingDoc>) =>
    adminApi.post<ApiSingleResponse<BrandingDoc>>('/branding', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<BrandingDoc>) =>
    adminApi.patch<ApiSingleResponse<BrandingDoc>>(`/branding/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/branding/${id}`),
};

export const websiteSettingsApi = {
  list: () => adminApi.get<ApiListResponse<WebsiteSettingsDoc>>('/website-settings').then(unwrapList),
  create: (payload: Partial<WebsiteSettingsDoc>) =>
    adminApi.post<ApiSingleResponse<WebsiteSettingsDoc>>('/website-settings', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<WebsiteSettingsDoc>) =>
    adminApi.patch<ApiSingleResponse<WebsiteSettingsDoc>>(`/website-settings/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/website-settings/${id}`),
};

export const contactsApi = {
  list: () => adminApi.get<ApiListResponse<ContactDoc>>('/contacts').then(unwrapList),
  update: (id: string, payload: Partial<ContactDoc>) =>
    adminApi.patch<ApiSingleResponse<ContactDoc>>(`/contacts/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/contacts/${id}`),
};

export const uploadApi = {
  uploadFile: async (file: File, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await adminApi.post<ApiSingleResponse<UploadResponse>>('/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (!event.total || !onProgress) {
          return;
        }
        onProgress(Math.round((event.loaded / event.total) * 100));
      },
    });

    return unwrapSingle(response);
  },
  deleteFile: (publicId: string) => adminApi.delete(`/upload/file/${encodeURIComponent(publicId)}`),
};

export const getActiveDoc = <T extends { isActive?: boolean }>(items: T[]) =>
  items.find((item) => item.isActive !== false) ?? items[0] ?? null;

export const collectImageUrls = (values: unknown): string[] => {
  const urls = new Set<string>();

  const walk = (value: unknown) => {
    if (!value) {
      return;
    }

    if (typeof value === 'string') {
      if (/^https?:\/\//.test(value) || value.startsWith('/images/')) {
        urls.add(value);
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    if (typeof value === 'object') {
      Object.values(value).forEach(walk);
    }
  };

  walk(values);
  return Array.from(urls);
};

export const homepageApi = {
  get: () => adminApi.get<ApiSingleResponse<HomepageDoc>>('/homepage').then(unwrapSingle),
  update: (id: string, payload: Partial<HomepageDoc>) =>
    adminApi.patch<ApiSingleResponse<HomepageDoc>>(`/homepage/${id}`, payload).then(unwrapSingle),
};

export const culturePageApi = {
  get: () => adminApi.get<ApiSingleResponse<CulturePageDoc>>('/culture-page').then(unwrapSingle),
  update: (id: string, payload: Partial<CulturePageDoc>) =>
    adminApi.patch<ApiSingleResponse<CulturePageDoc>>(`/culture-page/${id}`, payload).then(unwrapSingle),
};

export const impactPageApi = {
  get: () => adminApi.get<ApiSingleResponse<ImpactPageDoc>>('/impact-page').then(unwrapSingle),
  update: (id: string, payload: Partial<ImpactPageDoc>) =>
    adminApi.patch<ApiSingleResponse<ImpactPageDoc>>(`/impact-page/${id}`, payload).then(unwrapSingle),
};

export const careersPageApi = {
  get: () => adminApi.get<ApiSingleResponse<CareersPageDoc>>('/careers-page').then(unwrapSingle),
  update: (id: string, payload: Partial<CareersPageDoc>) =>
    adminApi.patch<ApiSingleResponse<CareersPageDoc>>(`/careers-page/${id}`, payload).then(unwrapSingle),
};

export const jobsApi = {
  list: () => adminApi.get<ApiListResponse<JobDoc>>('/jobs').then(unwrapList),
  create: (payload: Partial<JobDoc>) =>
    adminApi.post<ApiSingleResponse<JobDoc>>('/jobs', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<JobDoc>) =>
    adminApi.patch<ApiSingleResponse<JobDoc>>(`/jobs/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/jobs/${id}`),
};

export const contactPageApi = {
  get: () => adminApi.get<ApiSingleResponse<ContactPageDoc>>('/contact-page').then(unwrapSingle),
  update: (id: string, payload: Partial<ContactPageDoc>) =>
    adminApi.patch<ApiSingleResponse<ContactPageDoc>>(`/contact-page/${id}`, payload).then(unwrapSingle),
};

export const officesApi = {
  list: () => adminApi.get<ApiListResponse<OfficeDoc>>('/offices').then(unwrapList),
  create: (payload: Partial<OfficeDoc>) =>
    adminApi.post<ApiSingleResponse<OfficeDoc>>('/offices', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<OfficeDoc>) =>
    adminApi.patch<ApiSingleResponse<OfficeDoc>>(`/offices/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/offices/${id}`),
  reorder: async (items: OfficeDoc[]) => {
    await Promise.all(
      items.map((item, index) => officesApi.update(item._id, { sortOrder: index }))
    );
  },
};

export const investorsPageApi = {
  get: () => adminApi.get<ApiSingleResponse<InvestorsPageDoc>>('/investors-page').then(unwrapSingle),
  update: (id: string, payload: Partial<InvestorsPageDoc>) =>
    adminApi.patch<ApiSingleResponse<InvestorsPageDoc>>(`/investors-page/${id}`, payload).then(unwrapSingle),
};

export const financialReportsApi = {
  list: () => adminApi.get<ApiListResponse<FinancialReportDoc>>('/financial-reports').then(unwrapList),
  create: (payload: Partial<FinancialReportDoc>) =>
    adminApi.post<ApiSingleResponse<FinancialReportDoc>>('/financial-reports', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<FinancialReportDoc>) =>
    adminApi.patch<ApiSingleResponse<FinancialReportDoc>>(`/financial-reports/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/financial-reports/${id}`),
  reorder: async (items: FinancialReportDoc[]) => {
    await Promise.all(
      items.map((item, index) => financialReportsApi.update(item._id, { sortOrder: index }))
    );
  },
};

export const shareholdingPatternsApi = {
  list: () => adminApi.get<ApiListResponse<ShareholdingPatternDoc>>('/shareholding-patterns').then(unwrapList),
  create: (payload: Partial<ShareholdingPatternDoc>) =>
    adminApi.post<ApiSingleResponse<ShareholdingPatternDoc>>('/shareholding-patterns', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<ShareholdingPatternDoc>) =>
    adminApi.patch<ApiSingleResponse<ShareholdingPatternDoc>>(`/shareholding-patterns/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/shareholding-patterns/${id}`),
  reorder: async (items: ShareholdingPatternDoc[]) => {
    await Promise.all(
      items.map((item, index) => shareholdingPatternsApi.update(item._id, { sortOrder: index }))
    );
  },
};

export const boardMembersApi = {
  list: () => adminApi.get<ApiListResponse<BoardMemberDoc>>('/board-members').then(unwrapList),
  create: (payload: Partial<BoardMemberDoc>) =>
    adminApi.post<ApiSingleResponse<BoardMemberDoc>>('/board-members', payload).then(unwrapSingle),
  update: (id: string, payload: Partial<BoardMemberDoc>) =>
    adminApi.patch<ApiSingleResponse<BoardMemberDoc>>(`/board-members/${id}`, payload).then(unwrapSingle),
  remove: (id: string) => adminApi.delete(`/board-members/${id}`),
  reorder: async (items: BoardMemberDoc[]) => {
    await Promise.all(
      items.map((item, index) => boardMembersApi.update(item._id, { sortOrder: index }))
    );
  },
};
