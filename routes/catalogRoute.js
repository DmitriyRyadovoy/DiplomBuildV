import express from "express";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  allProductController,
  singleProductController,
  photoProductController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  searchProductController,
  allUserProductController,
  realtedProductController
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router()

// Routes

// Create Product
router.post('/create-product', requireSignIn, formidable(), createProductController)

// All Products
router.get('/all-catalog', allProductController)

// Single Product
router.get('/single-product/:slug', singleProductController)

// Get Photo
router.get('/product-photo/:pid', photoProductController);

// Delete Product
router.delete('/delete-product/:pid', deleteProductController);

// Update Product
router.put("/update-product/:pid", requireSignIn, formidable(), updateProductController);

// Filter Product
router.post("/product-filters", productFiltersController);

router.get("/related-product/:pid/:cid", realtedProductController);

// Search Product
router.get("/search/:keyword", searchProductController)

// My products
router.get("/my-product", requireSignIn, allUserProductController)

export default router;