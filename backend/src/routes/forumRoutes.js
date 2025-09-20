import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getPostsByAuthor,
  searchPosts
} from "../controllers/ForumController.js";

const router = express.Router();

// Post routes
router.post("/posts", createPost);
router.get("/posts", getAllPosts);
router.get("/posts/search", searchPosts);
router.get("/posts/:id", getPostById);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

// Post interaction routes
router.post("/posts/:id/like", likePost);
router.post("/posts/:id/dislike", dislikePost);

// Comment routes
router.post("/posts/:id/comments", addComment);
router.put("/posts/:postId/comments/:commentId", updateComment);
router.delete("/posts/:postId/comments/:commentId", deleteComment);

// Comment interaction routes
router.post("/posts/:postId/comments/:commentId/like", likeComment);
router.post("/posts/:postId/comments/:commentId/dislike", dislikeComment);

// User routes
router.get("/users/:author/posts", getPostsByAuthor);

export default router;
