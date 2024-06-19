import { payment, paymentStatus } from "../controllers/payment.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import express from "express";
const router = express.Router();
router.route("/").post(upload.none(""), payment);
router.route("/status:txnId").post(paymentStatus);

export default router;
