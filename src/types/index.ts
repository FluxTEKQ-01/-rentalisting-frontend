export type UserRole = 'visitor' | 'owner' | 'admin';

export type PropertyStatus =
  | 'draft'
  | 'submitted'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived';

export type PropertyCategory =
  | 'office'
  | 'shop_retail'
  | 'warehouse'
  | 'house_apartment'
  | 'villa'
  | 'open_plot_land'
  | 'event_venue'
  | 'coworking'
  | 'commercial_building'
  | 'parking'
  | 'showroom'
  | 'industrial'
  | 'hotel_banquet'
  | 'shooting_location'
  | 'storage';

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PropertyImage {
  url: string;
  publicId: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: PropertyCategory;
  price: number;
  maxPrice?: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  maxArea?: number;
  areaUnit: string;
  amenities: string[];
  images: PropertyImage[];
  videoUrl: string;
  location: PropertyLocation;
  owner: Pick<User, '_id' | 'name' | 'email' | 'mobile' | 'avatar'>;
  status: PropertyStatus;
  feedback?: string;
  feedbackProvidedAt?: string;
  reviewedBy?: Pick<User, '_id' | 'name'>;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  property: string;
  user: Pick<User, '_id' | 'name' | 'avatar'>;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalListings: number;
  pendingListings: number;
  approvedListings: number;
  rejectedListings: number;
  totalUsers: number;
  totalReviews: number;
}

export interface AnalyticsData {
  overview: DashboardStats;
  listingsByType: { _id: string; count: number }[];
  listingsOverTime: { _id: string; count: number }[];
}

export interface PropertyFormData {
  title: string;
  description: string;
  propertyType: PropertyCategory;
  price: number;
  maxPrice?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  maxArea?: number;
  amenities: string[];
  videoUrl: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images?: { url: string; publicId: string }[];
}
