import { Request, Response, NextFunction } from "express";
import { log, error } from "../utils/logger";
import {
  getGroceryItems,
  addGroceryItem,
  removeGroceryItem,
  updateGroceryItem,
  manageInventory,
  users,
  createNewAdmin,
  totalRevenue,
} from "../services/admin";
import { responseHandler, throwError } from "../utils/handler";

/**
 * Get all grocery items.
 */
export const getAllGroceryItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    log("fetching all grocery items");
    const data = await getGroceryItems(req.query);
    const response = responseHandler(
      200,
      "successfully fetched grocery items",
      data
    );
    log("successfully fetched grocery items.");
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

/**
 * Add a new grocery item.
 */
export const addNewGroceryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, inventory } = req.body;
    if (!name || !price || !inventory) {
      throwError(400, "Name, price, and inventory are required fields.");
    }
    log("adding new grocery item");
    const data = await addGroceryItem(name, price, inventory);
    const response = responseHandler(
      201,
      "successfully added new grocery item",
      data
    );
    log("successfully added new grocery item.");
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

/**
 * Remove a grocery item.
 */
export const removeGroceryItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    log("removing grocery item");
    await removeGroceryItem(parseInt(id));
    const response = responseHandler(200, "successfully removed grocery item");
    log("successfully removed grocery item.");
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

/**
 * Update a grocery item.
 */
export const updateGroceryItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, price, inventory } = req.body;
    log("updating grocery item");
    await updateGroceryItem(parseInt(id), { name, price, inventory });
    const response = responseHandler(200, "successfully updated grocery item");
    log("successfully updated grocery item.");
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

/**
 * Manage inventory of a grocery item.
 */
export const manageGroceryInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { quantity, action } = req.body;
    log("managing grocery inventory");
    await manageInventory(parseInt(id), quantity, action);
    const response = responseHandler(
      200,
      "successfully managed grocery inventory"
    );
    log("successfully managed grocery inventory.");
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

/**
 * Get all users.
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    log("fetching all users");
    const data = await users(req.query);
    const response = responseHandler(200, "successfully fetched users", data);
    log("successfully fetched users.");
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

/**
 * Create a new admin.
 */
export const newAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.query;
    log("creating new admin users");
    const data = await createNewAdmin(userId as string);
    const response = responseHandler(
      200,
      "successfully created new admin",
      data
    );
    log("successfully created new admin.");
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

/**
 * Get total revenue within a time period.
 */
export const getRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await totalRevenue(startDate as string, endDate as string);
    const response = responseHandler(200, "successfully fetched revenue", data);
    log("successfully fetched revenue.");
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};
