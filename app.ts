import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { exceptionHandler } from "./app/utils/handler";
import { connectDb } from "./app/config/database";
import router from "./app/routes";
import { seedDatabase } from "./app/utils/seeder";

const app = express();
const { PORT, DB_SYNC_FLAG, NODE_ENV } = process.env;
const shouldSync = DB_SYNC_FLAG === "true";

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use(exceptionHandler);

app.listen(PORT, async () => {
  await connectDb(shouldSync); // pass "true" to alter tables
  // await seedDatabase(10); // seed 10 grocery items
  console.info(
    "🚀 Express server started at port %d in %s mode. Time: %s",
    PORT,
    NODE_ENV,
    new Date().toLocaleString()
  );
});
