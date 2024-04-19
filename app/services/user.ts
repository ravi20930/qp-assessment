import { Op, QueryTypes } from "sequelize";
import { User, Order, GroceryItem } from "../models";
import { throwError } from "../utils/handler";
import { sequelize } from "../config/database";
import { getPagination, getPagingData } from "../utils/pagination";

interface getAllRequestQuery {
  page?: number;
  size?: number;
  sortbyInventory?: boolean;
  order?: string;
  id?: string;
}

export const profile = async (userId: string) => {
  return User.findByPk(userId);
};

export const findOrCreateByGoogleId = async (
  googleId: string,
  email: string
): Promise<User> => {
  let user = await User.findOne({ where: { googleId } });

  if (!user) {
    user = User.build({
      googleId,
      email,
    });
    await user.save();
  }

  return user;
};

/**
 * List grocery items.
 */
export const getGroceryItems = async (reqQuery: getAllRequestQuery) => {
  const { page, size, sortbyInventory, order, id } = reqQuery;
  const { limit, offset } = getPagination(page || 0, size || 10);

  const query: any = {};
  let whereCondition: any = { inventory: { [Op.gt]: 0 } };

  if (sortbyInventory && order) {
    query.order = [["inventory", order]];
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

export const createNewOrder = async (userId: string, itemIds: number[]) => {
  const customer = await User.findByPk(userId);
  if (!customer) {
    throwError(404, "Customer not found");
  }
  const items = await GroceryItem.findAll({
    where: {
      id: {
        [Op.in]: itemIds,
      },
    },
  });
  // console.log({ items, customer });

  if (!items || items.length !== itemIds.length) {
    throwError(404, "One or more items not found");
  }

  const totalItemPrice = items.reduce(
    (acc, item) => acc + parseFloat(item.price.toString()),
    0
  );

  console.log({ totalItemPrice });

  const order = Order.build({
    orderValue: totalItemPrice,
    customerId: userId,
  });
  await order.save();
  await order.addGroceryItems(items.map((item) => item.id));
  return order;
};

export const topSellingItems = async (count: number) => {
  const topSellingItems = await sequelize.query(
    `
    SELECT
      b.id,
      b.price,
      b.name,
      COUNT(oi.itemId) AS orderCount
    FROM
      GroceryItems AS b
    LEFT JOIN
      OrderItem AS oi ON b.id = oi.itemId
    GROUP BY
      b.id
    HAVING
      orderCount > 0
    ORDER BY
      orderCount DESC
    LIMIT :count;
    `,
    {
      replacements: { count },
      type: QueryTypes.SELECT,
    }
  );

  return topSellingItems;
};
