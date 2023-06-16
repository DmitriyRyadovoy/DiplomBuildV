import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {createCommentController, getCommentsController} from "../controllers/commentController.js";

// Router object
const router = express.Router();

//Create comment
router.post("/:pid/comments/create", requireSignIn, createCommentController);

//Get comments
router.get("/", getCommentsController);

export default router;