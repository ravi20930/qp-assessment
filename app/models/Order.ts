import {
  BelongsToManyAddAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";
import User from "./User";
import GroceryItem from "./GroceryItem";

interface OrderAttributes {
  id?: number;
  orderValue: number;
  customerId?: string;
  createdAt?: Date;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
  public id!: number;

  public orderValue!: number;

  public customerId!: string;

  public setCustomer!: BelongsToSetAssociationMixin<User, string>;

  public addGroceryItems!: BelongsToManyAddAssociationMixin<
    GroceryItem,
    number[]
  >;

  public readonly createdAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Order",
  }
);

export default Order;
