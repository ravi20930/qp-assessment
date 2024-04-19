import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

interface GroceryItemAttributes {
  id?: number;
  name: string;
  price: number;
  inventory: number;
}

class GroceryItem
  extends Model<GroceryItemAttributes>
  implements GroceryItemAttributes
{
  public id!: number;
  public name!: string;
  public price!: number;
  public inventory!: number;
}

GroceryItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    inventory: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "GroceryItem",
  }
);

export default GroceryItem;
