import apiClient from './client';
import type {
  AuthData,
  Property,
  Review,
  Notification,
  DashboardStats,
  AnalyticsData,
  ApiResponse,
  PaginatedResponse,
  PropertyFormData,
  PropertyCategory,
} from '../types';

const toQueryString = (params: Record<string, string | undefined>): string => {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== ''
  );
  if (filtered.length === 0) return '';
  return '?' + new URLSearchParams(filtered as [string, string][]).toString();
};

export const authApi = {
  register: (data: { name: string; email: string; mobile: string; password: string; role?: string }) =>
    apiClient.post<ApiResponse<AuthData>>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthData>>('/auth/login', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', {
        refreshToken,
      })
      .then((r) => r.data),

  getProfile: () =>
    apiClient.get<ApiResponse<{ user: any }>>('/auth/profile').then((r) => r.data),
};

export const propertyApi = {
  list: (params?: Record<string, string | undefined>) =>
    apiClient
      .get<PaginatedResponse<Property>>(`/properties${toQueryString(params || {})}`)
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<{ property: Property }>>(`/properties/${id}`).then((r) => r.data),

  create: (data: PropertyFormData) =>
    apiClient.post<ApiResponse<{ property: Property }>>('/properties', data).then((r) => r.data),

  update: (id: string, data: Partial<PropertyFormData>) =>
    apiClient
      .put<ApiResponse<{ property: Property }>>(`/properties/${id}`, data)
      .then((r) => r.data),

  submit: (id: string) =>
    apiClient
      .post<ApiResponse<{ property: Property }>>(`/properties/${id}/submit`)
      .then((r) => r.data),

  resubmit: (id: string, data: Partial<PropertyFormData>) =>
    apiClient
      .post<ApiResponse<{ property: Property }>>(`/properties/${id}/resubmit`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/properties/${id}`).then((r) => r.data),

  getMyListings: (params?: Record<string, string | undefined>) =>
    apiClient
      .get<PaginatedResponse<Property>>(`/properties/my-listings${toQueryString(params || {})}`)
      .then((r) => r.data),

  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    return apiClient
      .post<ApiResponse<{ images: { url: string; publicId: string }[] }>>('/uploads/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  deleteImage: (publicId: string) =>
    apiClient
      .delete<ApiResponse<null>>('/uploads/image', { data: { publicId } })
      .then((r) => r.data),
};

export const adminApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard').then((r) => r.data),

  approveProperty: (id: string) =>
    apiClient
      .put<ApiResponse<{ property: Property }>>(`/admin/properties/${id}/approve`)
      .then((r) => r.data),

  rejectProperty: (id: string, feedback: string) =>
    apiClient
      .put<ApiResponse<{ property: Property }>>(`/admin/properties/${id}/reject`, { feedback })
      .then((r) => r.data),

  archiveProperty: (id: string) =>
    apiClient
      .put<ApiResponse<{ property: Property }>>(`/admin/properties/${id}/archive`)
      .then((r) => r.data),

  getUsers: (params?: Record<string, string | undefined>) =>
    apiClient
      .get<PaginatedResponse<any>>(`/admin/users${toQueryString(params || {})}`)
      .then((r) => r.data),

  toggleUserStatus: (id: string) =>
    apiClient
      .put<ApiResponse<{ user: any }>>(`/admin/users/${id}/toggle-status`)
      .then((r) => r.data),

  deleteUser: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/admin/users/${id}`).then((r) => r.data),

  getReviews: (params?: Record<string, string>) =>
    apiClient
      .get<PaginatedResponse<Review>>(`/admin/reviews${toQueryString(params || {})}`)
      .then((r) => r.data),

  getAnalytics: () =>
    apiClient.get<ApiResponse<AnalyticsData>>('/analytics').then((r) => r.data),
};

export const reviewApi = {
  list: (propertyId: string, params?: Record<string, string>) =>
    apiClient
      .get<PaginatedResponse<Review>>(`/reviews/property/${propertyId}${toQueryString(params || {})}`)
      .then((r) => r.data),

  create: (propertyId: string, data: { rating: number; comment: string }) =>
    apiClient
      .post<ApiResponse<{ review: Review }>>(`/reviews/property/${propertyId}`, data)
      .then((r) => r.data),

  delete: (reviewId: string) =>
    apiClient.delete<ApiResponse<null>>(`/reviews/${reviewId}`).then((r) => r.data),
};

export const notificationApi = {
  list: (params?: Record<string, string>) =>
    apiClient
      .get<PaginatedResponse<Notification> & { unreadCount: number }>(
        `/notifications${toQueryString(params || {})}`
      )
      .then((r) => r.data),

  markAsRead: (id: string) =>
    apiClient.put<ApiResponse<{ notification: Notification }>>(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: () =>
    apiClient.put<ApiResponse<null>>('/notifications/read-all').then((r) => r.data),
};

export const propertyCategories: { value: PropertyCategory; label: string }[] = [
  { value: 'office', label: 'Office Spaces' },
  { value: 'shop_retail', label: 'Shops & Retail' },
  { value: 'warehouse', label: 'Warehouses' },
  { value: 'house_apartment', label: 'Houses & Apartments' },
  { value: 'villa', label: 'Villas' },
  { value: 'open_plot_land', label: 'Open Plots & Land' },
  { value: 'event_venue', label: 'Event Venues' },
  { value: 'coworking', label: 'Co-working Spaces' },
  { value: 'commercial_building', label: 'Commercial Buildings' },
  { value: 'parking', label: 'Parking Spaces' },
  { value: 'showroom', label: 'Showrooms' },
  { value: 'industrial', label: 'Industrial Spaces' },
  { value: 'hotel_banquet', label: 'Hotels & Banquet Halls' },
  { value: 'shooting_location', label: 'Shooting Locations' },
  { value: 'storage', label: 'Storage Spaces' },
];

export const amenitiesList = [
  'Parking',
  'Swimming Pool',
  'Gym',
  'Security',
  'Elevator',
  'AC',
  'Heating',
  'Balcony',
  'Garden',
  'Furnished',
  'WiFi',
  'Laundry',
  'Pet Friendly',
  'Storage',
  'Rooftop',
  'Concierge',
];
