import { Op } from "sequelize";
import { pickBy, identity } from "lodash";
import { User, UserGroup, Group, Order } from "../models";
import { getPagination, getPagingData } from "../utils/pagination";
import { throwError } from "../utils/handler";
import GroceryItem from "../models/GroceryItem";

interface getAllRequestQuery {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sortbyDate?: boolean;
  sortbyInventory?: boolean;
  order?: string;
  inventoryOrder?: string;
  id?: string;
  userId?: string;
}

interface updateGroceryItem {
  name?: string;
  price?: number;
  inventory?: number;
}

/**
 * List grocery items.
 */
export const getGroceryItems = async (reqQuery: getAllRequestQuery) => {
  const {
    fromDate,
    toDate,
    page,
    size,
    sortbyDate,
    sortbyInventory,
    order,
    inventoryOrder,
    id,
  } = reqQuery;
  const { limit, offset } = getPagination(page || 0, size || 10);

  const mFromDate = fromDate ? `${fromDate} 00:00:00` : undefined;
  const mToDate = toDate ? `${toDate} 23:59:59` : undefined;

  const query: any = {};
  let whereCondition: any = {};

  if (fromDate) {
    whereCondition.createdAt = {
      [Op.gt]: mFromDate,
    };
  }
  if (toDate) {
    whereCondition.createdAt = {
      [Op.lt]: mToDate,
    };
  }
  if (fromDate && toDate) {
    whereCondition.createdAt = {
      [Op.lt]: mToDate,
      [Op.gt]: mFromDate,
    };
  }

  if (sortbyDate && order) {
    query.order = [["createdAt", order]];
  }
  if (sortbyInventory && order) {
    query.order = [["inventory", inventoryOrder]];
  }
  if (whereCondition) {
    query.where = whereCondition;
  }

  if (id) {
    whereCondition = { id };
  }

  query.where = whereCondition;
  query.limit = limit;
  query.offset = offset;
  query.attributes = ["id", "name", "price", "inventory"];

  const groceryItems = await GroceryItem.findAndCountAll(query);

  if (!groceryItems) {
    throwError(404, "Grocery items not found.");
  }
  const response = getPagingData(groceryItems, page || 0, limit);
  return response;
};

/**
 * Add a new grocery item to the system.
 */
export const addGroceryItem = async (
  name: string,
  price: number,
  inventory: number
) => {
  return await GroceryItem.create({ name, price, inventory });
};

/**
 * Remove a grocery item from the system.
 */
export const removeGroceryItem = async (groceryItemId: number) => {
  const groceryItem = await GroceryItem.findByPk(groceryItemId);
  if (groceryItem) {
    return await groceryItem.destroy();
  } else throwError(404, "Grocery item not found.");
};

/**
 * Update details (e.g., name, price) of an existing grocery item.
 */
export const updateGroceryItem = async (
  groceryItemId: number,
  data: updateGroceryItem
) => {
  const groceryItem = await GroceryItem.findByPk(groceryItemId);

  if (groceryItem) {
    Object.assign(groceryItem, pickBy(data, identity));
    await groceryItem.save();
  } else throwError(404, "Grocery item not found.");

  return groceryItem;
};

/**
 * Manage inventory levels of grocery items.
 */
export const manageInventory = async (
  groceryItemId: number,
  quantity: number,
  action: "increase" | "decrease"
) => {
  const groceryItem = await GroceryItem.findByPk(groceryItemId);
  if (groceryItem) {
    if (action === "increase") {
      groceryItem.inventory += quantity;
    } else if (action === "decrease") {
      if (groceryItem.inventory < quantity) {
        throwError(400, "Insufficient inventory.");
      }
      groceryItem.inventory -= quantity;
    }
    await groceryItem.save();
  } else throwError(404, "Grocery item not found.");
};

/**
 *
 */
export const users = async (reqQuery: getAllRequestQuery) => {
  const { fromDate, toDate, page, size, sortbyDate, order, userId } = reqQuery;
  const { limit, offset } = getPagination(page || 0, size || 10);

  const mFromDate = fromDate ? `${fromDate} 00:00:00` : undefined;
  const mToDate = toDate ? `${toDate} 23:59:59` : undefined;

  const query: any = {};
  let whereCondition: any = {};

  if (fromDate) {
    whereCondition.createdAt = {
      [Op.gt]: mFromDate,
    };
  }
  if (toDate) {
    whereCondition.createdAt = {
      [Op.lt]: mToDate,
    };
  }
  if (fromDate && toDate) {
    whereCondition.createdAt = {
      [Op.lt]: mToDate,
      [Op.gt]: mFromDate,
    };
  }

  if (sortbyDate && order) {
    query.order = [["createdAt", order]];
  }
  if (whereCondition) {
    query.where = whereCondition;
  }

  if (userId) {
    whereCondition = { id: userId };
  }

  query.where = whereCondition;
  query.limit = limit;
  query.offset = offset;
  query.attributes = ["id", "username", "email", "phone"];

  const user = await User.findAndCountAll(query);

  if (!user) {
    return 404;
  }
  const response = getPagingData(user, page || 0, limit);
  return response;
};

/**
 *
 */
export const createNewAdmin = async (userId: string) => {
  const group = await Group.findOne({
    where: { name: "ADMIN" },
    attributes: ["id"],
  });

  if (group !== null) {
    const { id } = group;
    await UserGroup.findOrCreate({
      where: { groupId: id, userId }, // Fixed the order of properties
    });
  }
  throwError(404, "Group not found.");
};

/**
 *
 */
export const totalRevenue = async (startDate: string, endDate: string) => {
  const parsedStartDate = startDate
    ? new Date(startDate as string)
    : new Date(0);
  const parsedEndDate = endDate ? new Date(endDate as string) : new Date();

  // Find all orders within the given time period
  const orders: Order[] = await Order.findAll({
    where: {
      createdAt: {
        [Op.between]: [parsedStartDate, parsedEndDate],
      },
    },
  });

  // Calculate total revenue
  const totalRevenue = orders.reduce(
    (acc: number, order: { orderValue: number }) => acc + +order.orderValue,
    0
  );

  // individual orders
  const individualRevenues = orders.map((order: Order) => ({
    orderId: order.id,
    orderValue: order.orderValue,
  }));

  return { totalRevenue, individualRevenues };
};
