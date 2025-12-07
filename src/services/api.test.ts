import { 
  fetchUserById, 
  uploadProfilePicture, 
  getProfilePictureUrl,
  fetchUsers
} from './api';

// Mock fetch globally
globalThis.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchUsers', () => {
    it('should fetch users successfully', async () => {
      const mockResponse = {
        users: [
          { id: 1, username: 'testuser', email: 'test@example.com' }
        ],
        total: 1,
        skip: 0,
        limit: 10
      };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchUsers(10, 0);
      
      expect(result).toEqual(mockResponse);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('dummyjson.com/users?limit=10&skip=0'),
        expect.any(Object)
      );
    });

    it('should throw error on failed fetch', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error'
      });

      await expect(fetchUsers()).rejects.toThrow();
    });
  });

  describe('fetchUserById', () => {
    it('should fetch user by id successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      const result = await fetchUserById('1');
      
      expect(result).toEqual(mockUser);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('dummyjson.com/users/1'),
        expect.any(Object)
      );
    });

    it('should throw error when user not found', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(fetchUserById('999')).rejects.toThrow();
    });
  });

  describe('uploadProfilePicture', () => {
    it('should store profile picture in localStorage', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      // Mock URL.createObjectURL
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      
      const result = await uploadProfilePicture('1', file, 'testuser');
      
      expect(result).toEqual({ url: 'blob:mock-url' });
      expect(localStorage.getItem('profile_picture_testuser')).toBe('blob:mock-url');
    });

    it('should use userId if username not provided', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      
      await uploadProfilePicture('1', file);
      
      expect(localStorage.getItem('profile_picture_1')).toBe('blob:mock-url');
    });
  });

  describe('getProfilePictureUrl', () => {
    it('should retrieve profile picture from localStorage', () => {
      localStorage.setItem('profile_picture_testuser', 'blob:stored-url');
      
      const url = getProfilePictureUrl('testuser', '1', 'fallback.jpg');
      
      expect(url).toBe('blob:stored-url');
    });

    it('should return fallback when no stored picture', () => {
      const url = getProfilePictureUrl('testuser', '1', 'fallback.jpg');
      
      expect(url).toBe('fallback.jpg');
    });

    it('should return null when no fallback provided', () => {
      const url = getProfilePictureUrl('testuser', '1');
      
      expect(url).toBeNull();
    });

    it('should prioritize username-based key over userId', () => {
      localStorage.setItem('profile_picture_testuser', 'blob:username-url');
      localStorage.setItem('profile_picture_1', 'blob:userid-url');
      
      const url = getProfilePictureUrl('testuser', '1', 'fallback.jpg');
      
      expect(url).toBe('blob:username-url');
    });
  });
});
