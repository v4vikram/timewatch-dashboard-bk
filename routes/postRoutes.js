import express from "express";

import {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
} from "../controllers/post/post.js";

import {
  createCategory,
  getCategories,
} from "../controllers/post/category.js";

import { createTag, getTags } from "../controllers/post/tag.js";

// import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ---------------------------------- */
/*             POST CRUD              */
/* ---------------------------------- */

// GET all posts
router.get("/", getAllPosts);

// GET post by slug
router.get("/:slug", getPostBySlug);

// CREATE post
router.post("/", createPost);

// UPDATE post
router.put("/:id", updatePost);

// DELETE post
router.delete("/:id", deletePost);


/* ---------------------------------- */
/*             CATEGORIES             */
/* ---------------------------------- */

// GET categories
router.get("/categories/all", getCategories);

// CREATE category
router.post("/categories", createCategory);


/* ---------------------------------- */
/*                TAGS                */
/* ---------------------------------- */

// GET tags
router.get("/tags/all", getTags);

// CREATE tag
router.post("/tags", createTag);

export default router;
