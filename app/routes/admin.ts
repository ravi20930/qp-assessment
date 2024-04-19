import express, { Router } from "express";
import {
  getAllGroceryItems,
  addNewGroceryItem,
  removeGroceryItemById,
  updateGroceryItemById,
  manageGroceryInventory,
  getAllUsers,
  newAdmin,
  getRevenue,
} from "../controllers/admin";

const router: Router = express.Router();

// Routes for managing users
router.get("/users", getAllUsers);
router.post("/create-admin", newAdmin);

// Routes for managing revenue
router.get("/revenue", getRevenue);

// Routes for managing grocery items
router.get("/grocery/items", getAllGroceryItems);
router.post("/grocery/items", addNewGroceryItem);
router.delete("/grocery/items/:id", removeGroceryItemById);
router.put("/grocery/items/:id", updateGroceryItemById);
router.post("/grocery/items/:id/inventory", manageGroceryInventory);

export default router;
