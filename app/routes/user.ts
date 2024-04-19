import express, { Router } from "express";
import {
  createOrder,
  getProfile,
  getTopSellingItems,
  getAllGroceryItems,
} from "../controllers/user";

const router: Router = express.Router();

router.get("/", getProfile);
router.post("/create-order", createOrder);
router.get("/grocery-list", getAllGroceryItems);
router.get("/top-sellers", getTopSellingItems);

export default router;
