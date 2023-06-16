import express from "express";
import {
  registerController,
  loginController,
  testController,
  updateProfileController,
  photoUserController,
  allUserController,
  deleteUserController,
  singleUserController,
  updatePhotoProfileController
  // forgotPasswordController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

// Router object
const router = express.Router();

// Routing

// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

// Forgot Password || POST
// router.post('/forgot-password', forgotPasswordController)

// Test routes
router.get("/test", requireSignIn, isAdmin, testController);

// Pretected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true})
})

// Pretected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true})
})

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//update photo profile
router.put("/profile/photo", requireSignIn, formidable(), updatePhotoProfileController);

// Get Photo
router.get('/user-photo/:pid', photoUserController);

// All Users
router.get('/all-user', allUserController);

// Single Product
router.get('/single-user/:pid', singleUserController)

// Delete Users
router.delete('/delete-user/:id', deleteUserController);
export default router;