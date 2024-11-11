import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/db.config.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";

import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 5000;
connectDB();
//const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
//});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
