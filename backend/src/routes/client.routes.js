import express from "express";
import {
  bookEmployee,
  clientLogin,
  deleteClient,
  getAllClientDetails,
  getParticularClientDetails,
  insertClient,
  updateAddress,
  updateClientPassword,
  updatePhone,
} from "../controllers/client.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(upload.single("avatar"), insertClient);
router.route("/login").post(upload.none(), clientLogin);
router
  .route("/update/password")
  .post(upload.none(), verifyJWT, updateClientPassword);

router.route("/update/phoneno").post(upload.none(), verifyJWT, updatePhone);
router.route("/update/address").post(upload.none(), verifyJWT, updateAddress);
router.route("/particular/client/:id").get(getParticularClientDetails);
router.route("/all/client").get(getAllClientDetails);
router.route("/book/employee/").post(upload.none(), verifyJWT, bookEmployee);

router.route("/delete/client/:id").delete(deleteClient);

export default router;
