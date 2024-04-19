import casual from "casual";
import { GroceryItem } from "../models";

const generateGroceryItems = async (count: number) => {
  try {
    const groceryItemsData = Array.from({ length: count }, () => ({
      name: casual.word,
      price: casual.integer(10, 100),
      inventory: casual.integer(1, 100),
    }));
    await GroceryItem.bulkCreate(groceryItemsData);

    console.log(`${count} grocery items seeded successfully.`);
  } catch (error) {
    console.error("Error seeding grocery items:", error);
  }
};

export const seedDatabase = async (num: number) => {
  await generateGroceryItems(num);
};
