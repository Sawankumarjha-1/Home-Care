import express from "express";
import {
  getInfo,
  logout,
  updateInfo,
  updatePassword,
  verifyEmail,
} from "../controllers/common.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/").get(verifyJWT, getInfo);
router.route("/logout").get(verifyJWT, logout);
router.route("/update").patch(upload.single("avatar"), verifyJWT, updateInfo);
router.route("/verify-email").post(upload.none(), verifyEmail);
router.route("/update-password").post(upload.none(), updatePassword);

export default router;
