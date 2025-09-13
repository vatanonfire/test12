import express from 'express';
import { 
  createPost, 
  getPosts, 
  getPost, 
  updatePost, 
  deletePost, 
  getUserPosts 
} from '../controllers/postController';
import { authenticateToken } from '../middleware/auth';
import { requireUser, requireModerator } from '../middleware/roles';

const router = express.Router();

// All post routes require authentication
router.use(authenticateToken);

/**
 * POST /api/posts
 * Create a new post
 * - Requires: USER role or higher
 * - Users can only create posts for themselves
 */
router.post('/', requireUser, createPost);

/**
 * GET /api/posts
 * Get all posts with pagination
 * - Requires: USER role or higher
 * - Users see only published posts
 * - Moderators and admins see all posts
 */
router.get('/', requireUser, getPosts);

/**
 * GET /api/posts/:postId
 * Get a single post by ID
 * - Requires: USER role or higher
 * - Users can only see published posts
 * - Moderators and admins can see any post
 */
router.get('/:postId', requireUser, getPost);

/**
 * PUT /api/posts/:postId
 * Update a post
 * - Requires: USER role or higher
 * - Users can only update their own posts
 * - Moderators and admins can update any post
 */
router.put('/:postId', requireUser, updatePost);

/**
 * DELETE /api/posts/:postId
 * Delete a post
 * - Requires: USER role or higher
 * - Users can only delete their own posts
 * - Moderators and admins can delete any post
 */
router.delete('/:postId', requireUser, deletePost);

/**
 * GET /api/posts/user/:userId?
 * Get posts by user ID
 * - Requires: USER role or higher
 * - Users can only see their own posts
 * - Moderators and admins can see any user's posts
 * - If no userId provided, returns current user's posts
 */
router.get('/user/:userId?', requireUser, getUserPosts);

export default router;
