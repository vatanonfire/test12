import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { body, validationResult } from 'express-validator';
import { ROLES } from '../middleware/roles';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Create a new post
 * - Users can create their own posts
 * - Moderators and admins can create posts for any user
 */
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    // Validation
    await body('title').notEmpty().trim().isLength({ min: 1, max: 200 }).run(req);
    await body('content').notEmpty().trim().isLength({ min: 1, max: 5000 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { title, content } = req.body;
    const authorId = req.user!.id;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating post'
    });
  }
};

/**
 * Get all posts with pagination
 * - Users can see all published posts
 * - Moderators and admins can see all posts (including unpublished)
 */
export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};
    if (req.user?.role === ROLES.USER) {
      where.isPublished = true;
    }

    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const total = await prisma.post.count({ where });

    return res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching posts'
    });
  }
};

/**
 * Get a single post by ID
 * - Users can see published posts
 * - Moderators and admins can see any post
 */
export const getPost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const where: any = { id: postId };
    if (req.user?.role === ROLES.USER) {
      where.isPublished = true;
    }

    const post = await prisma.post.findFirst({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    return res.json({
      success: true,
      data: { post }
    });
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching post'
    });
  }
};

/**
 * Update a post
 * - Users can only update their own posts
 * - Moderators and admins can update any post
 */
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    // Validation
    await body('title').optional().trim().isLength({ min: 1, max: 200 }).run(req);
    await body('content').optional().trim().isLength({ min: 1, max: 5000 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { postId } = req.params;
    const { title, content, isPublished } = req.body;

    // Check if post exists and user has permission
    const existingPost = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check permissions
    const canEdit = req.user!.role === ROLES.ADMIN || 
                   req.user!.role === ROLES.MODERATOR || 
                   existingPost.authorId === req.user!.id;

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts'
      });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (isPublished !== undefined && req.user!.role !== ROLES.USER) {
      updateData.isPublished = isPublished;
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post }
    });
  } catch (error) {
    console.error('Update post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating post'
    });
  }
};

/**
 * Delete a post
 * - Users can only delete their own posts
 * - Moderators and admins can delete any post
 */
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    // Check if post exists and user has permission
    const existingPost = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check permissions
    const canDelete = req.user!.role === ROLES.ADMIN || 
                     req.user!.role === ROLES.MODERATOR || 
                     existingPost.authorId === req.user!.id;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    await prisma.post.delete({
      where: { id: postId }
    });

    return res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting post'
    });
  }
};

/**
 * Get user's own posts
 * - Users can only see their own posts
 * - Moderators and admins can see any user's posts
 */
export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check permissions
    const canViewAll = req.user!.role === ROLES.ADMIN || req.user!.role === ROLES.MODERATOR;
    const requestedUserId = userId || req.user!.id;

    if (!canViewAll && requestedUserId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own posts'
      });
    }

    const where: any = { authorId: requestedUserId };
    if (req.user?.role === ROLES.USER && requestedUserId !== req.user.id) {
      where.isPublished = true;
    }

    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const total = await prisma.post.count({ where });

    return res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching user posts'
    });
  }
};
