/**
 * API Service Layer
 * Centralized API calls with error handling and retries
 */

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

type FetchOptions = RequestInit & {
  retries?: number;
  retryDelay?: number;
};

/**
 * Generic fetch wrapper with retry logic and error handling
 */
async function apiFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { retries = 2, retryDelay = 500, ...requestInit } = options;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, requestInit);

      if (!response.ok) {
        throw new APIError(
          `Request failed: ${response.statusText}`,
          response.status,
          response.statusText
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof APIError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Retry with exponential backoff
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

// ============= User API =============

export type APIUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phone?: string;
  birthDate?: string;
  image?: string;
  role?: string;
  gender?: string;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  company?: {
    name?: string;
    title?: string;
    department?: string;
  };
};

export type UsersResponse = {
  users: APIUser[];
  total: number;
  skip: number;
  limit: number;
};

/**
 * Fetch paginated list of users
 */
export async function fetchUsers(limit = 10, skip = 0): Promise<UsersResponse> {
  return apiFetch<UsersResponse>(
    `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
  );
}

/**
 * Search users by query
 */
export async function searchUsers(query: string): Promise<UsersResponse> {
  return apiFetch<UsersResponse>(
    `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`
  );
}

/**
 * Fetch a single user by ID
 */
export async function fetchUserById(id: string | number): Promise<APIUser> {
  return apiFetch<APIUser>(`https://dummyjson.com/users/${id}`);
}

/**
 * Update user profile (simulated)
 * Note: DummyJSON doesn't persist changes, but returns success response
 */
export async function updateUserProfile(
  id: string | number,
  updates: Partial<APIUser>
): Promise<APIUser> {
  return apiFetch<APIUser>(`https://dummyjson.com/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

/**
 * Simulate profile picture upload
 * In production, this would upload to a storage service
 */
export async function uploadProfilePicture(
  userId: string | number,
  file: File,
  username?: string
): Promise<{ url: string }> {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Create filename with username
  const fileExt = file.name.split('.').pop() || 'jpg';
  const filename = username ? `${username}_profile_picture.${fileExt}` : `user_${userId}_profile_picture.${fileExt}`;
  
  // Create local object URL for preview
  // In production, upload to S3, Cloudinary, etc. and save to public/images
  const url = URL.createObjectURL(file);
  
  // Store the mapping in localStorage so we can retrieve it later
  try {
    localStorage.setItem(`profile_picture_${username || userId}`, url);
  } catch (e) {
    console.error('Failed to save profile picture reference', e);
  }
  
  return { url };
}

/**
 * Get profile picture URL for a user
 * Checks localStorage first for uploaded pictures, then falls back to API image
 */
export function getProfilePictureUrl(username?: string, userId?: string, fallbackUrl?: string): string | null {
  const key = `profile_picture_${username || userId}`;
  const stored = localStorage.getItem(key);
  return stored || fallbackUrl || null;
}

// ============= KYC/Review API =============

export type KYCStatus = 'pending' | 'approved' | 'rejected';

export type KYCReview = {
  id: string;
  userId: string;
  status: KYCStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
};

// Simulated KYC storage (in-memory)
const kycReviews = new Map<string, KYCReview>();

/**
 * Get KYC review for a user
 */
export async function getKYCReview(userId: string): Promise<KYCReview | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return kycReviews.get(userId) || null;
}

/**
 * Submit KYC review (Officer only)
 */
export async function submitKYCReview(review: KYCReview): Promise<KYCReview> {
  await new Promise(resolve => setTimeout(resolve, 500));
  kycReviews.set(review.userId, review);
  return review;
}

/**
 * Get all KYC reviews (Officer only)
 */
export async function getAllKYCReviews(): Promise<KYCReview[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return Array.from(kycReviews.values());
}
