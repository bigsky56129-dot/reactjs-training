/**
 * RBAC (Role-Based Access Control) utilities
 */

export type Role = 'user' | 'officer';

export type Permission = 
  | 'view:own-profile'
  | 'edit:own-profile'
  | 'view:all-profiles'
  | 'access:review-page'
  | 'view:all-reviews'
  | 'view:own-review';

/**
 * Define role permissions
 */
const rolePermissions: Record<Role, Permission[]> = {
  user: [
    'view:own-profile',
    'edit:own-profile',
    'view:own-review',
  ],
  officer: [
    'view:own-profile',
    'edit:own-profile',
    'view:all-profiles',
    'access:review-page',
    'view:all-reviews',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Check if user can access another user's profile
 */
export function canAccessProfile(
  currentUserId: string | undefined,
  currentUserRole: Role | undefined,
  targetUserId: string
): boolean {
  if (!currentUserId || !currentUserRole) return false;
  
  // Officers can access all profiles
  if (hasPermission(currentUserRole, 'view:all-profiles')) return true;
  
  // Users can only access their own profile
  return currentUserId === targetUserId;
}

/**
 * Check if user can edit a profile
 */
export function canEditProfile(
  currentUserId: string | undefined,
  currentUserRole: Role | undefined,
  targetUserId: string
): boolean {
  if (!currentUserId || !currentUserRole) return false;
  
  // For now, users can only edit their own profile
  // Officers can edit all profiles if needed (extend as per requirements)
  return currentUserId === targetUserId && hasPermission(currentUserRole, 'edit:own-profile');
}
