import { Request, Response, NextFunction } from "express";
import { log, error } from "../utils/logger";
import {
  createNewOrder,
  getGroceryItems,
  profile,
  topSellingItems,
} from "../services/user";
import { responseHandler, throwError } from "../utils/handler";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user;
    const userProfile = await profile(userId);
    const response = responseHandler(
      200,
      "successfully fetched profile.",
      userProfile
    );
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

export const getAllGroceryItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    log("fetching all available grocery items");
    const data = await getGroceryItems(req.query);
    const response = responseHandler(
      200,
      "successfully fetched available grocery items",
      data
    );
    log("successfully fetchedavailable grocery items.");
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: customerId } = req.user;
    const { itemIds } = req.body;
    console.log({ itemIds });
    const order = await createNewOrder(customerId, itemIds);
    const response = responseHandler(
      200,
      "successfully created new order.",
      order
    );
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

export const getTopSellingItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { size } = req.params;
    const items = await topSellingItems(Number(size || 10));
    const response = responseHandler(
      200,
      "successfully fetched top sellers.",
      items
    );
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};
