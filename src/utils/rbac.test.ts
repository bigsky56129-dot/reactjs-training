import { hasPermission, canAccessProfile, canEditProfile, type Permission } from './rbac';

describe('RBAC Utilities', () => {
  describe('hasPermission', () => {
    it('should return true for user with matching permission', () => {
      expect(hasPermission('user', 'view:own-profile')).toBe(true);
    });

    it('should return false for user without permission', () => {
      expect(hasPermission('user', 'view:all-profiles')).toBe(false);
    });

    it('should return true for officer with all permissions', () => {
      expect(hasPermission('officer', 'view:all-profiles')).toBe(true);
      expect(hasPermission('officer', 'access:review-page')).toBe(true);
    });

    it('should handle undefined role gracefully', () => {
      expect(hasPermission(undefined, 'view:own-profile')).toBe(false);
    });
  });

  describe('canAccessProfile', () => {
    it('should allow user to access their own profile', () => {
      expect(canAccessProfile('1', 'user', '1')).toBe(true);
    });

    it('should prevent user from accessing other profiles', () => {
      expect(canAccessProfile('1', 'user', '2')).toBe(false);
    });

    it('should allow officer to access any profile', () => {
      expect(canAccessProfile('1', 'officer', '2')).toBe(true);
      expect(canAccessProfile('5', 'officer', '10')).toBe(true);
    });

    it('should handle undefined userId', () => {
      expect(canAccessProfile(undefined, 'user', '2')).toBe(false);
    });

  });

  describe('canEditProfile', () => {
    it('should allow user to edit their own profile', () => {
      expect(canEditProfile('1', 'user', '1')).toBe(true);
    });

    it('should prevent user from editing other profiles', () => {
      expect(canEditProfile('1', 'user', '2')).toBe(false);
    });

    it('should only allow users to edit their own profile', () => {
      // Current implementation: users can only edit their own profile
      // Officers cannot edit other profiles based on current rbac.ts implementation
      expect(canEditProfile('1', 'officer', '1')).toBe(true);
      expect(canEditProfile('1', 'officer', '2')).toBe(false);
    });

    it('should handle undefined userId', () => {
      expect(canEditProfile(undefined, 'user', '2')).toBe(false);
    });
  });
});
