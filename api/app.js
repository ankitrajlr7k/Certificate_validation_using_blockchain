import express from "express";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import generateRoute from "./routes/generate.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

const port = 3000;

dotenv.config();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/generate", generateRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
