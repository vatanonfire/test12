import { Request, Response, NextFunction } from 'express';

// Extended Request interface with user information
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Role hierarchy - higher roles have more permissions
export const ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR', 
  ADMIN: 'ADMIN'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Role hierarchy for permission checking
const ROLE_HIERARCHY = {
  [ROLES.USER]: 1,
  [ROLES.MODERATOR]: 2,
  [ROLES.ADMIN]: 3
};

/**
 * Check if user has required role or higher
 * @param userRole - User's current role
 * @param requiredRole - Minimum required role
 * @returns boolean - True if user has sufficient permissions
 */
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Middleware to require specific role
 * @param requiredRole - Minimum role required to access the route
 * @returns Express middleware function
 */
export const requireRole = (requiredRole: UserRole) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!hasRole(req.user.role as UserRole, requiredRole)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${requiredRole}`
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to require admin role
 * Only admins can access these routes
 */
export const requireAdmin = requireRole(ROLES.ADMIN);

/**
 * Middleware to require moderator or higher role
 * Moderators and admins can access these routes
 */
export const requireModerator = requireRole(ROLES.MODERATOR);

/**
 * Middleware to require user or higher role
 * All authenticated users can access these routes
 */
export const requireUser = requireRole(ROLES.USER);

/**
 * Middleware to check if user owns the resource or has admin/moderator role
 * @param resourceOwnerId - Function to extract owner ID from request
 * @returns Express middleware function
 */
export const requireOwnershipOrRole = (
  resourceOwnerId: (req: AuthRequest) => string | null,
  requiredRole: UserRole = ROLES.MODERATOR
) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const ownerId = resourceOwnerId(req);
    
    // Admin can access everything
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    // Moderator can access if they have required role
    if (hasRole(req.user.role as UserRole, requiredRole)) {
      return next();
    }

    // User can only access their own resources
    if (ownerId && req.user.id === ownerId) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  };
};

/**
 * Middleware to check if user can manage posts
 * - Users can only manage their own posts
 * - Moderators can manage any post
 * - Admins can manage any post
 */
export const requirePostOwnershipOrModerator = requireOwnershipOrRole(
  (req: AuthRequest) => req.params.postId || req.body.postId || null,
  ROLES.MODERATOR
);

/**
 * Middleware to check if user can manage users
 * - Only admins can manage users
 */
export const requireUserManagement = requireRole(ROLES.ADMIN);

/**
 * Utility function to get user permissions
 * @param userRole - User's role
 * @returns Object with permission flags
 */
export const getUserPermissions = (userRole: UserRole) => {
  return {
    canManageUsers: userRole === ROLES.ADMIN,
    canManagePosts: hasRole(userRole, ROLES.MODERATOR),
    canCreatePosts: hasRole(userRole, ROLES.USER),
    canEditOwnPosts: hasRole(userRole, ROLES.USER),
    canDeleteOwnPosts: hasRole(userRole, ROLES.USER),
    canViewAllPosts: hasRole(userRole, ROLES.USER),
    canManageRituals: hasRole(userRole, ROLES.ADMIN),
    canViewAnalytics: hasRole(userRole, ROLES.ADMIN),
  };
};
