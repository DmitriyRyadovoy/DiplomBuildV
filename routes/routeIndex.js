import express from "express";
import authRoute from "./authRoute.js"
import categoryRouter from "./categoryRoute.js"
import catalogRoute from "./catalogRoute.js"
import commentRoute from "./commentRoute.js"

//router object
const router = express.Router();

router.use('/auth', authRoute);
router.use('/category', categoryRouter);
router.use('/catalog', catalogRoute);
router.use('/comment', commentRoute);

export default router;